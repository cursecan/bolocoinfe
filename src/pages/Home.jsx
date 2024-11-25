import { useSelector } from "react-redux"
import MiningButton from "../components/MiningButton"
import { selectUser } from "../stores/userSlice"
import { selectCalculate } from "../stores/calculateSlice"
import Loading from "./Loading"

const Home = () => {
  const user = useSelector(selectUser)
  const calculate = useSelector(selectCalculate)

  return (
    <div className="">
      {
        (user && calculate) ? (
          <div>
            <MiningButton />
          </div>
        ) : <Loading />
      }
    </div>
  )
}

export default Home