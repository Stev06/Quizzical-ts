import type { JSX } from "react";
import { useState } from "react";

import SelectionMenu from "./SelectionMenu";
import Quiz from "./Quiz";

export type Question = {
    type: "multiple" | "boolean";
    difficulty: "easy" | "medium" | "hard";
    catagory: string;
    correct_answer: string;
    incorrect_answers: string[];
    question: string;
};

export default function App(): JSX.Element {
    //state
    const [questions, setQuestions] = useState<Question[] | null>(null);

    //derved state
    const quizCanStart: boolean = questions != null;

    function restart() {
        setQuestions(null);
    }

    function getQuestionData(formData: FormData): void {
        let APIString = "https://opentdb.com/api.php?amount=5";
        const catagory = formData.get("catagory");
        const difficulty = formData.get("difficulty");
        const type = formData.get("type");

        if (catagory) {
            APIString = APIString + `&catagory=${catagory}`;
        }

        if (difficulty) {
            APIString = APIString + `&difficulty=${difficulty}`;
        }

        if (type) {
            APIString = APIString + `&type=${type}`;
        }

        fetch(APIString)
            .then((res) => res.json())
            .then((data) => {
                const questions: Question[] = data.results;
                setQuestions(questions);
            });
    }

    return (
        <main>
            <header>
                <h1>Quizzical</h1>
                <p>Answer the questions and test your knowledge!</p>
            </header>
            {!quizCanStart && <SelectionMenu submit={getQuestionData} />}
            {questions != null && (
                <Quiz questions={questions} restart={restart} />
            )}
            <footer>
                <p>
                    Background from{" "}
                    <a href="https://www.svgbackgrounds.com/set/free-svg-backgrounds-and-patterns/">
                        SVGBackgrounds.com
                    </a>
                    --App by Steven Nguyen
                </p>
            </footer>
        </main>
    );
}
