import type { JSX } from "react"
import type { Question } from "./App"
import { nanoid } from "nanoid"
import clsx from "clsx"
import React, { useState } from "react"

export type QuizProps = {
    questions: Question[]
    restart: () => void
}

type Answer = {
    question: Question
    answer: string
}

export default function Quiz(props: QuizProps): JSX.Element {
    const [answers, setAnswers] = useState<Answer[]>([])
    const [isDone, setIsDone] = useState(false)

    const correctAnswers: number = (() => {
        let i = 0
        props.questions.forEach((q: Question) => {
            if (
                answers.some(
                    (a: Answer) =>
                        a.question === q && a.answer === q.correct_answer,
                )
            ) {
                i++
            }
        })
        return i
    })()

    function createQuestionElements(): JSX.Element[] {
        return props.questions.map((question, index) => (
            <div className="question-box" key={index}>
                <p>{question.question}</p>
                {createButtonElements(question)}
                <hr />
            </div>
        ))
    }

    function createButtonElements(question: Question): JSX.Element {
        let options: string[] = [
            ...question.incorrect_answers,
            question.correct_answer,
        ].sort()

        const buttons: JSX.Element[] = options.map((answer) => {
            const isPressed: boolean = answers.some(
                (a) => a.answer === answer && a.question === question,
            )
            return (
                <button
                    className={clsx("quiz-button", isPressed && "pressed")}
                    key={nanoid()}
                    onClick={(event) => chooseAnswer(event, question)}
                >
                    {answer}
                </button>
            )
        })

        return <div className="answer-button-container">{buttons}</div>
    }

    function chooseAnswer(event: React.MouseEvent, question: Question): void {
        const newAnswer: Answer = {
            question: question,
            answer: event.currentTarget.textContent,
        }

        setAnswers((prev) => {
            const questionInState = prev.some((a) => a.question === question)

            if (prev.length < 1) {
                return [newAnswer]
            } else if (!questionInState) {
                return [...prev, newAnswer]
            } else {
                return prev.map((a) =>
                    a.question === question ? newAnswer : a,
                )
            }
        })
    }

    function done() {
        isDone ? props.restart() : setIsDone(true)
        //highlight right answers.
        //print score
    }

    return (
        <section className="quiz">
            {createQuestionElements()}
            <button className="done-button" onClick={done}>
                {isDone ? "New Quiz" : "Done"}
            </button>
            {isDone ? (
                <p>{`You scored ${correctAnswers}/${props.questions.length}!`}</p>
            ) : null}
        </section>
    )
}
