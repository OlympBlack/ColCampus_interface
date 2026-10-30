/**
 * Compresse et redimensionne automatiquement les images côté client avant téléversement.
 * Permet d'importer des photos de n'importe quelle taille (10 Mo, 20 Mo, etc.)
 * sans lenteur, sans dépasser les limites serveur et sans erreur validation.uploaded.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File> {
  // Si ce n'est pas une image (ex: PDF), on le laisse tel quel
  if (!file.type.startsWith('image/')) {
    return file
  }

  // Si le fichier est déjà petit (moins de 300 Ko), pas besoin de retraiter
  if (file.size < 300 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        // Conserver les proportions tout en limitant la résolution max
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        // Dessin haute fidélité
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
            const compressedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })

            // Utiliser le fichier compressé seulement s'il est plus léger
            resolve(compressedFile.size < file.size ? compressedFile : file)
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => resolve(file)
      img.src = event.target?.result as string
    }

    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/**
 * Compresse une liste de fichiers image en parallèle
 */
export async function compressImages(
  files: File[],
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File[]> {
  return Promise.all(files.map((f) => compressImage(f, maxWidth, maxHeight, quality)))
}
