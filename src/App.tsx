import type { JSX } from "react"
import { useState } from "react"

import SelectionMenu from "./SelectionMenu"
import Quiz from "./Quiz"

export type Question = {
    type: "multiple" | "boolean"
    difficulty: "easy" | "medium" | "hard"
    catagory: string
    correct_answer: string
    incorrect_answers: string[]
    question: string
}

export default function App(): JSX.Element {
    //state
    const [questions, setQuestions] = useState<Question[] | null>(null)
    const [canStart, setCanStart] = useState<boolean>(false)

    function restart() {
        setQuestions(null)
        setCanStart(false)
    }

    function getQuestionData(formData: FormData): void {
        let APIString = "https://opentdb.com/api.php?amount=5"
        const catagory = formData.get("category")
        const difficulty = formData.get("difficulty")
        const type = formData.get("type")

        if (catagory) {
            APIString = APIString + `&category=${catagory}`
        }

        if (difficulty) {
            APIString = APIString + `&difficulty=${difficulty}`
        }

        if (type) {
            APIString = APIString + `&type=${type}`
        }

        fetch(APIString)
            .then((res) => res.json())
            .then((data) => {
                const questions: Question[] = data.results
                setQuestions(questions)
                setCanStart(true)
            })
    }

    return (
        <main>
            {!canStart && (
                <header>
                    <h1>Quizzical</h1>
                    <p>Answer the questions and test your knowledge!</p>
                </header>
            )}
            {!canStart && <SelectionMenu submit={getQuestionData} />}
            {questions != null && (
                <Quiz questions={questions} restart={restart} />
            )}
            <footer>
                <p>
                    Background from{" "}
                    <a href="https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/">
                        SVGBackgrounds.com
                    </a>
                    ; App by Steven Nguyen
                </p>
            </footer>
        </main>
    )
}
