// Provides one-shot event communication between the Text Content node action and form.
const textContentEditTarget = new EventTarget()
const TEXT_CONTENT_EDIT_EVENT = 'text-content-edit'

/**
 * Requests the active Text Content form to open the rich text editor.
 */
export function requestTextContentEdit() {
  textContentEditTarget.dispatchEvent(new Event(TEXT_CONTENT_EDIT_EVENT))
}

/**
 * Subscribes to Text Content edit requests and returns an unsubscribe function.
 */
export function onTextContentEdit(listener: () => void) {
  const eventListener: EventListener = () => listener()
  textContentEditTarget.addEventListener(TEXT_CONTENT_EDIT_EVENT, eventListener)

  return () => {
    textContentEditTarget.removeEventListener(TEXT_CONTENT_EDIT_EVENT, eventListener)
  }
}
