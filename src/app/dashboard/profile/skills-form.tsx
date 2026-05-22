"use client"

import { useState } from "react";
import { updateSkills } from "./actions";

export function SkillsForm({initialSkills} : {initialSkills: string[]}) {
    const [tags, setTags] = useState(initialSkills)
    const [input, setInput] = useState("")

    function addTag() {
        const trimmed = input.trim()
        if(trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
        }
        setInput("")
    }

    function removeTag(tag: string) {
        setTags(tags.filter((t) => t !== tag))
    }

    async function handleSubmit(formData: FormData) {
        formData.append("skills", JSON.stringify(tags))
        await updateSkills(formData)
    }

    return (
        <form action={handleSubmit}>
            <div>
                {tags.map((tag)=>(<span key={tag}>{tag}
                    <button type="submit" onClick={() => removeTag(tag)}>X</button>
                </span>))}
            </div>
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                }
            }}
            placeholder="Type a skill and press Enter"
            />
            <button type="submit">Save</button>
        </form>
    )
}