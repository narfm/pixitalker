import { MathContent, MathExample, MathProblem } from "@/components/types/math"

export const parseXML = (xml: string): MathContent => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, "text/xml")
  
  const isExample = doc.querySelector("example") !== null
  
  const setup = {
    objects: Array.from(doc.querySelector(isExample ? "setup" : "problem > setup")?.children || []).map(obj => ({
      emoji: obj.getAttribute("emoji") || "",
      count: parseInt(obj.getAttribute("count") || "0"),
      text: obj.textContent || ""
    }))
  }
  
  const visuals = {
    objects: Array.from(doc.querySelector("visuals")?.children || []).map(obj => ({
      emoji: obj.getAttribute("emoji") || "",
      count: parseInt(obj.getAttribute("count") || "0")
    }))
  }

  const operation = doc.querySelector("operation")?.textContent || ""

  if (isExample) {
    return {
      type: 'example',
      setup,
      visuals,
      operation,
      explanation: doc.querySelector("explanation")?.textContent || "",
      result: doc.querySelector("result")?.textContent || ""
    } as MathExample
  }

  const options = Array.from(doc.querySelectorAll("options > option")).map(option => ({
    value: option.getAttribute("value") || "",
    is_correct: option.getAttribute("is_correct") === "true",
    response: option.querySelector("response")?.textContent || "",
    action: option.querySelector("action")?.textContent || ""
  }))

  return {
    type: 'problem',
    setup,
    visuals,
    operation,
    question: doc.querySelector("question")?.textContent || "",
    hint: doc.querySelector("hint")?.textContent || "",
    expected_interaction: doc.querySelector("expected_interaction")?.textContent || "",
    options
  } as MathProblem
}

