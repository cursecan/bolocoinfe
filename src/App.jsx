import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { db } from './firebase.js'

import { 
  collection, doc, getDocs, 
  limit, onSnapshot, orderBy, query, 
  setDoc
} from 'firebase/firestore'

import Home from './pages/Home'
import ButtonNavigation from './components/ButtonNavigation'
import Earning from './pages/Earning'
import Friends from './pages/Friends'
import Wallet from './pages/Wallet'
import Leader from './pages/Leader'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setUser } from './stores/userSlice.js'
import CalculateNums from './components/CalculateNums.jsx'
import Loading from './pages/Loading.jsx'

function App() {

  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  
  const [webApp, setWebApp] = useState()

  const processLinks = (links) => {
    return Object.entries(links).reduce((ac, [key, value]) => {
      acc[key] = {
        ...value,
        time: value.time ? value.time.toMillis() : null
      }
      return acc
    }, {})
  }

  useEffect(() => {
    const getUser = () => {
      const unsub = onSnapshot(doc(db, 'users', webApp.id), async (docSnap) => {
        if (docSnap.exists()) {
          dispatch(
            setUser({
              uid: webApp.id,
              firstName: docSnap.data().firstName,
              lastName: docSnap.data().lastName,
              username: docSnap.data().username,
              balance: docSnap.data().balance,
              isMining: docSnap.data().isMining,
              isPremium: docSnap.data().isPremium,
              mineRate: docSnap.data().mineRate,
              miningStartDate: docSnap.data().miningStartDate ? 
                docSnap.data().miningStartDate.toMillis() : null,
              languageCode: docSnap.data().languageCode
            })
          )
          console.log(docSnap.data());
        } else {
          await setDoc(doc(db, 'users', webApp.id), {
            userid: webApp.id,
            firstName: webApp.firstName,
            lastName: webApp.lastName,
            username: webApp.username,
            languageCode: webApp.languageCode,
            isMining: false,
            balance: 0.0,
            mineRate: 0.001,
            miningStartDate: null,
            isPremium: webApp.isPremium
          })
        }
      })

      return () => {
        unsub()
      }
    }
    
    if (webApp) {
      getUser()
    }
  }, [dispatch, webApp])

  useEffect(() => {
    const tg = window.Telegram.WebApp
    tg.ready()
    

    if (tg?.initDataUnsafe?.user?.id) {
      const userId = tg.initDataUnsafe.user.id
      const userIdString = userId.toString()

      setWebApp({
        id: userIdString,
        firstName: tg?.initDataUnsafe?.user?.first_name,
        lastName: tg?.initDataUnsafe?.user?.last_name,
        username: tg?.initDataUnsafe?.user?.username,
        languageCode: tg?.initDataUnsafe?.user?.language_code,
        isPremium: tg?.initDataUnsafe?.user?.is_premium
      })

      tg.expand()
    } else {
      setWebApp({
        id: '12341234',
        firstName: 'Firstname',
        lastName: 'Lastname',
        username: '@username',
        languageCode: 'en',
        isPremium: false
      })
    }

  }, [])

  

  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ButtonNavigation />
        {user && (
          <>
            <CalculateNums />
          </>
        )}
        <Routes>
          <Route path='*' Component={Loading} />
          <Route path='/' Component={Home} />
          <Route path='/earning' Component={Earning} />
          <Route path='/friend' Component={Friends} />
          <Route path='/wallet' Component={Wallet} />
          <Route path='/leader' Component={Leader} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
