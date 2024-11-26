import { useDispatch, useSelector } from "react-redux"
import MiningButton from "../components/MiningButton"
import { selectUser } from "../stores/userSlice"
import { selectCalculate } from "../stores/calculateSlice"
import Loading from "./Loading"
import { toast } from "react-toastify"
import { setCoinshow } from "../stores/coinshowSlice"
import { setMessage } from "../stores/massageSlice"

const Home = () => {
  const user = useSelector(selectUser)
  const calculate = useSelector(selectCalculate)
  const dispatch = useDispatch()

  const ckk = () => {
    dispatch(setMessage({
      varian: 'info', 
      text: 'this message'
    }))
  }

  return (
    <div className="">
      {
        (user && calculate) ? (
          <div className="px-6">
            <MiningButton />
            <button onClick={() => ckk()}>toast</button>
          </div>
        ) : <Loading />
      }
    </div>
  )
}

export default Home