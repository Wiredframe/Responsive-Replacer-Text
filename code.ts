// Define the old and new text style names as arrays
const oldTextStyleNames = [ 
  "Heading / Giant / Bold",
  "Heading / Giant / Semibold",
  "Heading / Giant / Regular",
  "Heading / Huge / Bold",
  "Heading / Huge / Semibold",
  "Heading / Huge / Regular",
  "Heading / Large / Bold",
  "Heading / Large / Semibold",
  "Heading / Large / Regular",
  "Heading / Normal / Bold",
  "Heading / Normal / Semibold",
  "Heading / Normal / Regular",
  "Heading / Small / Bold",
  "Heading / Small / Semibold",
  "Heading / Small / Regular",
  "Heading / Tiny / Bold",
  "Heading / Tiny / Semibold",
  "Heading / Tiny / Regular",
  "Heading / Tiniest / Bold",
  "Heading / Tiniest / Semibold",
  "Heading / Tiniest / Regular",
  "Heading / Tiniest / Light",
  "Body / Huge / Semibold",
  "Body / Huge / Regular",
  "Body / Large / Semibold",
  "Body / Large / Regular",
  "Body / Large / Light",
  "Body / Normal / Semibold",
  "Body / Normal / Regular",
  "Body / Normal / Light",
  "Body / Small / Semibold",
  "Body / Small / Regular",
  "Body / Small / Light",
  "Body / Tiny / Semibold",
  "Body / Tiny / Regular",
  "Body / Tiny / Light",
  "Body / Tiniest / Semibold",
  "Body / Tiniest / Regular",
  "Body / Tiniest / Light"
]

const newTextStyleNames = [
  "Heading / Large / Bold",
  "Heading / Large / Semibold",
  "Heading / Large / Regular",
  "Heading / Normal / Bold",
  "Heading / Normal / Semibold",
  "Heading / Normal / Regular",
  "Heading / Small / Bold",
  "Heading / Small / Semibold",
  "Heading / Small / Regular",
  "Heading / Small / Bold",
  "Heading / Small / Semibold",
  "Heading / Small / Regular",
  "Heading / Tiny / Bold",
  "Heading / Tiny / Semibold",
  "Heading / Tiny / Regular",
  "Heading / Tiny / Bold",
  "Heading / Tiny / Semibold",
  "Heading / Tiny / Regular",
  "Heading / Tiniest / Bold",
  "Heading / Tiniest / Semibold",
  "Heading / Tiniest / Regular",
  "Heading / Tiniest / Light",
  "Body / Large / Semibold",
  "Body / Large / Regular",
  "Body / Normal / Semibold",
  "Body / Normal / Regular",
  "Body / Normal / Light",
  "Body / Small / Semibold",
  "Body / Small / Regular",
  "Body / Small / Light",
  "Body / Small / Semibold",
  "Body / Small / Regular",
  "Body / Small / Light",
  "Body / Tiny / Semibold",
  "Body / Tiny / Regular",
  "Body / Tiny / Light",
  "Body / Tiniest / Semibold",
  "Body / Tiniest / Regular",
  "Body / Tiniest / Light"
];

// Function for loading all fonts used in a text node
const loadFonts = async (textNode: TextNode) => {
  // Get an array of all the font names used in the text node
  const fontNames = textNode.getRangeAllFontNames(0, textNode.characters.length);

  // Load all the fonts asynchronously
  await Promise.all(fontNames.map(figma.loadFontAsync));
};

// Get the selected frame
const selectedFrame = figma.currentPage.selection[0] as FrameNode;

if (selectedFrame) {
  // Replace text styles in all text nodes
  const textNodes = selectedFrame.findAll(node => node.type === "TEXT") as TextNode[];
  if (textNodes.length === 0) {
    // Show an error message if no text nodes are found
    figma.notify("No text nodes found in the selected frame.");
    figma.closePlugin();
  } else {
    // Keep track of the number of fonts that are still loading
    let numFontsLoading = 0;

    textNodes.forEach(async (textNode) => {
      // Load all fonts used in the text node
      numFontsLoading++;
      await loadFonts(textNode);

      // Replace text style in the text node
      const oldTextStyleName = figma.getLocalTextStyles().find(style => style.id === textNode.textStyleId)?.name;
      const oldTextStyleIndex = oldTextStyleNames.indexOf(oldTextStyleName);
      if (oldTextStyleIndex !== -1) {
        const newTextStyleName = newTextStyleNames[oldTextStyleIndex];
        const newTextStyle = figma.getLocalTextStyles().find(style => style.name === newTextStyleName);
        if (newTextStyle) {
          textNode.textStyleId = newTextStyle.id;
        }
      }

      // Decrement the count of fonts that are still loading
      numFontsLoading--;
      if (numFontsLoading === 0) {
        // Close the plugin when all fonts have finished loading
        figma.notify("Text styles updated successfully.");
        figma.closePlugin();
      }
    });
  }
} else {
  // Show an error message if no frame is selected
  figma.notify("Please select a frame.");
  figma.closePlugin();
}