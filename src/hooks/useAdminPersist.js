import { useState, useEffect } from "react";

const useAdminPersist = () => {
    const [adminPersist, setAdminPersist] = useState(JSON.parse(localStorage.getItem('adminPersist')) || false)

    useEffect(() => {
        localStorage.setItem('adminPersist', JSON.stringify(adminPersist))
    }, [adminPersist])

    return [adminPersist, setAdminPersist]
}


export default useAdminPersist