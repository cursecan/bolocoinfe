import { useLocation, useNavigate } from "react-router-dom"
import HomeIcon from "../components/icons/HomeIcon"
import TaskIcon from "./icons/TaskIcon"
import UsersIcon from "./icons/UsersIcon"
import WalletIcon from "./icons/WalletIcon"
import TrophyIcon from "./icons/TrophyIcon"

const ButtonItem = ({name, icon, path}) => {
  const navigate = useNavigate()
  const location = useLocation()  

  return (
    <button onClick={() => navigate(path)} className={[location.pathname === path ? 'text-blue-500' : 'text-white/70']}>
      <div className="flex justify-center text-center text-sm">
        <div className="">
          <div className="flex justify-center">
            { icon }
          </div>
          <div className="">{name}</div>
        </div>
      </div>
    </button>
  )
}

const ButtonNavigation = () => {

  const buttonList = [
    {
      name: 'Home',
      icon: <HomeIcon />,
      path: '/'
    }, {
      name: 'Tasks',
      icon: <TaskIcon />,
      path: '/earning'
    }, {
      name: 'Leader',
      icon: <TrophyIcon />,
      path: '/leader'
    }, {
      name: 'Friends',
      icon: <UsersIcon />,
      path: '/friend'
    }, {
      name: 'Wallet',
      icon: <WalletIcon />,
      path: '/wallet'
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0">
        <ul className="flex items-center bg-white/10 h-16">
            {
              buttonList.map((i, index) => {
                return (
                  <li key={index} className="flex-1 flex justify-center">
                      <ButtonItem name={i.name} icon={i.icon} path={i.path} />
                  </li>
                )
              })
            }
        </ul>
    </div>
  )
}

export default ButtonNavigation