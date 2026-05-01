import type { JSX } from "react";
import type { Question } from "./App";
import { nanoid } from "nanoid";

export type QuizProps = {
    questions: Question[];
    restart: () => void;
};

export default function Quiz(props: QuizProps): JSX.Element {

    function createQuestionElements(): JSX.Element[] {
        return props.questions.map((question) => (
            <div className="question-box">
                <p key={question.question}>{question.question}</p>
                {createButtonElements(question)}
                <hr/>
            </div>
        ));
    }

    function createButtonElements(question: Question): JSX.Element{
        const answers:string[] = [...question.incorrect_answers, question.correct_answer]
        const buttons:JSX.Element[] = answers.map(answer => (
            <button key={nanoid()}>
                {answer}
            </button>
        ))
            
        return(
            <div className="answer-button-container">
                {buttons}
            </div>
        )
    }

    const questionElements: JSX.Element[] = createQuestionElements();

    return (
        <>
            {questionElements}

            <button onClick={props.restart}>Reset</button>
        </>
    );
}
