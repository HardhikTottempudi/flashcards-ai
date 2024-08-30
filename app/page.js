"use client"
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid } from "@mui/material";
import Head from "next/head";

import { useRouter } from "next/navigation";
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn,userId } = useAuth(); // Use useAuth to get the userId
  const router = useRouter();
  const handleStart = () => {
    if (!isSignedIn) {
      alert("sign in required")
      return; // If the user is not signed in, return null
    }
    router.push('/generate'); // Navigate to the /generate page if user is signed in
  };
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: "POST",
      headers: {
        origin:"https://localhost:3000",
      },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }
    

    const stripe = await getStripe();
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    if(error){
      console.warn(error.message)
    }
  }
  return (
    <Container maxWidth='100vw'>
      <Head>
        <title>Flashcards Saas</title>
        <meta name="description" content="create flashcards from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard Saas</Typography>
          <SignedOut>
            <Button variant="inherit" href="/sign-in">Login</Button>
            <Button variant="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          textAlign: 'center',
          my: 4
        }}>
        <Typography variant="h2">Welcome to flashcard Saas</Typography>
        <Typography variant="h5">
          {' '}
          The easist way to make flashcards from scratchs
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleStart}>Get Started</Button>
      </Box>
      <Box sx={{my:6}}>
        <Typography variant="h6">Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy text input</Typography>
            <Typography>
              {' '}
              Simply input your text and let our software do the rest.
              Creating flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              {' '}
              Our Ai intelligence breaks down your text into 
              concise flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>
              {' '}
              Access your flashcards from any device, at any time.
              Study on the go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my:6 ,textAlign:'center'}}>
      <Typography variant="h4" gutterBottom>Pricing</Typography>
      <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
          <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius:2,
            }}>
            <Typography variant="h5" gutterBottom>Basic</Typography>
            <Typography variant="h6" gutterBottom>5$ / month</Typography>
            <Typography>
              {' '}
              Acess to basic flashcards features and limited storage
            </Typography>
            <Button sx={{mt:2}} variant="contained" color="primary">Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
          <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius:2,
            }}>
            <Typography variant="h5" gutterBottom>Pro</Typography>
            <Typography variant="h6" gutterBottom>10$ / month</Typography>
            <Typography>
              {' '}
              Unlimited flashcards and storage, with priority support.  
            </Typography>
            <Button sx={{mt:2}} variant="contained" color="primary" onClick={handleSubmit}>Choose Pro </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
