

"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { collection, getDoc, setDoc, doc, updateDoc } from "firebase/firestore"
import { CardActionArea, CardContent, Container, Grid, Typography, Card, Fab, IconButton, Box } from "@mui/material"
export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])
    if (!isLoaded || !isSignedIn) { return <></> }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }
    const handleDeleteClick = async (index) => {
        if (!user) return;
        const docRef = doc(collection(db, "users"), user.id);
        const updatedFlashcards = [...flashcards];
        updatedFlashcards.splice(index, 1); // Remove the flashcard from the local state

        await updateDoc(docRef, { flashcards: updatedFlashcards }); // Update the flashcards in the database
        setFlashcards(updatedFlashcards); // Update the state to reflect the deletion
    };

    return <Container maxWidth='100vw'>
        <Fab variant="contained" sx={{ mt: 2 }} onClick={() => { router.push('/generate') }}>
            back
        </Fab>
        <Grid container spacing={3} sx={{
            mt: 4
        }}>
            {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => { handleCardClick(flashcard.name) }}>
                            <CardContent>
                                <Typography variant="h6">{flashcard.name}</Typography>
                            </CardContent>
                        </CardActionArea>
                        {/* Delete button outside the CardActionArea */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                            <IconButton onClick={() => handleDeleteClick(index)} aria-label="delete">
                                🗑️ {/* Trash can emoji */}
                            </IconButton>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Container>
}