let activeConversationId: number | null = null

export function setActiveConversationId(conversationId: number | null) {
  activeConversationId = conversationId
}

export function getActiveConversationId(): number | null {
  return activeConversationId
}
