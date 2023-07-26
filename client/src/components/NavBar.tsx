import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import {Bell, Envelope, HouseDoorFill, PencilSquare, Person, PersonBadge, PersonCircle, Search, ThreeDots, Twitter} from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import axios from 'axios'
import { useAuthDispatch, useAuthState } from '@/context/auth'


const NavBar: React.FC = () => {
    const {loading, authenticated} = useAuthState();
    const dispatch = useAuthDispatch();
    const router = useRouter();

    const logout = () => {
        axios.post("/auth/logout")
        .then(() => { //then 메서드는 자바스크립트에서 Promise가 성공적으로 완료됐을때 호출되는 콜백함수
            dispatch("LOGOUT"); //디스패치 케이스 중 로그아웃을 가져오는 것
            window.location.reload();
        })
        .catch ((error) => {
            console.log(error);
        });
    };

  return (
    <div className='d-flex flex-column flex-shrink-0 bg-light' style={{width: "4.5rem"}}>
      <Link href="/" className='d-block p-4 link-dark text-decoration-none ' data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
      
      <Twitter width="24" height="24" />
      <span className='visually-hidden'>Icon-only</span>
      </Link>
      
        <ul className='nav nav-pills nav-plush flex-column mb-auto text-center'>
            <li className='nav-item'>
                <Link href="/" className='nav-link py-3 border-bottom rounded-0' aria-current="page" data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Home" data-bs-original-title="Home">
                    <HouseDoorFill width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/search" className='nav-link py-3 border-bottom rounded-0' data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Search" data-bs-original-title="Search">
                    <Search width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/alarm" className='nav-link py-3 border-bottom rounded-0' data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Alarm" data-bs-original-title="Alarm">
                    <Bell width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/dm" className='nav-link py-3 border-bottom rounded-0' data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Dm" data-bs-original-title="Dm">
                    <Envelope width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/user" className='nav-link py-3 border-bottom rounded-0' data-bs-toggle="tooltip" data-bs-placement="right" aria-label="User" data-bs-original-title="User">
                    <Person width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/options" className='nav-link py-3 border-bottom rounded-0' data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Option" data-bs-original-title="Option">
                    <ThreeDots width="24" height="24" fill="black" />
                </Link>            
            </li>

            <li className='nav-item'>
                <Link href="/tweets/create" 
                className='nav-link py-3 border-bottom rounded-0' 
                data-bs-toggle="tooltip" data-bs-placement="right" aria-label="Post" data-bs-original-title="Post"
                onClick={(e)=>{
                    if (!authenticated) {
                        e.preventDefault();
                        router.push("login");
                    }
                }}
                >
                    <PencilSquare width="24" height="24" fill="black" />
                </Link>            
            </li>        
       </ul>
       <div className='dropdown border-top'>
        
        <Dropdown>
        <Dropdown.Toggle variant="transparent" style={{backgroundColor: 'transparent', border: 'none'}}>
                <Image src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" alt="user" width="40" height="40" className='rounded-circle'/>
            </Dropdown.Toggle>
            
            <Dropdown.Menu>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Item href="/user">Profile</Dropdown.Item>
                <Dropdown.Divider />
                {!loading && authenticated ? (
                <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
                ) : (<>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
                </>)}
            </Dropdown.Menu>
        </Dropdown>
        
       </div>

    </div>
  )
}

export default NavBar
