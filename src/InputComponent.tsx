import { useState } from "react"

export default function InputComponent() {
    const [searchTerm, setSearchTerm] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
    }

    return (
        <input 
            type="text" 
            placeholder="search" 
            value={searchTerm}
            onChange={handleChange}
        />
    )
}