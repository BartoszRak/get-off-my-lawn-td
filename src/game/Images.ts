export enum Image {
  GlassPanel = "glass-panel",
  CursorHand = "cursor-hand",
  PointerFlat = "pointer-flat",
  PaperHeart = "paper-heart",
  PaperHeartFull = "paper-heart-full"
}

export const Images: Record<string, [string, string]> = {
  [Image.GlassPanel]: [Image.GlassPanel, "./assets/glassPanel.png"],
  [Image.CursorHand]: [Image.CursorHand, "./assets/cursor_hand.png"],
  [Image.PointerFlat]: [Image.PointerFlat, "./assets/cursor_pointerFlat.png"],
  [Image.PaperHeart]: [Image.PaperHeart, "./assets/paper-heart3.png"],
  [Image.PaperHeartFull]: [Image.PaperHeartFull, "./assets/paper-heart3-full.png"]
};
