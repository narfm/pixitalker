import { MathContent, MathObject } from "@/components/types/math"

export function parseXML(xmlString: string): MathContent {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, "text/xml")
  
  const isExample = xmlString.includes("<example>")
  
  // Parse setup objects
  const setupObjects: MathObject[] = Array.from(doc.querySelectorAll("setup object")).map(obj => ({
    emoji: obj.getAttribute("emoji") || "🔵",
    count: parseInt(obj.getAttribute("count") || "0", 10),
    text: obj.textContent || undefined
  }))

  // Parse visual objects
  const visualObjects: MathObject[] = Array.from(doc.querySelectorAll("visuals object")).map(obj => ({
    emoji: obj.getAttribute("emoji") || "🔵",
    count: parseInt(obj.getAttribute("count") || "0", 10)
  }))

  if (isExample) {
    return {
      type: "example",
      setup: { objects: setupObjects },
      visuals: { objects: visualObjects },
      operation: doc.querySelector("operation")?.textContent || "",
      explanation: doc.querySelector("explanation")?.textContent || "",
      result: doc.querySelector("result")?.textContent || ""
    }
  } else {
    return {
      type: "problem",
      setup: { objects: setupObjects },
      visuals: { objects: visualObjects },
      operation: doc.querySelector("operation")?.textContent || "",
      question: doc.querySelector("question")?.textContent || "",
      hint: doc.querySelector("hint")?.textContent || "",
      expected_interaction: doc.querySelector("expected_interaction")?.textContent || ""
    }
  }
}

