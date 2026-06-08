'use client';

import { useEffect, useState } from "react";
import { createClient } from "../databaseconfig/client-component";
import HeaderDash from '../internNavigation/internHeaders'
import { UserArr, UserLog } from "../userInfo/userLog";
import { addListDb } from "../databaseconfig/serverDb";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'
/* Images */
import addIcon from '../../../public/dashboard-img/add-icon.png'
import closeIcon from '../../../public/dashboard-img/close-icon.png'
import addUser from '../../../public/lists-img/addUser.png'
import userList from '../../../public/header-img/user-icon.png'
import trashbag from '../../../public/lists-img/delete-icon.png'
import editIcon from '../../../public/lists-img/editList.png'

type databaseDataCreation = {
  id: string,
  name: string,
  people: string[],
  lastChange?: string,
  itemsList?: [],
  created_at?: string,
  stockAvg: null
}


export default function Dashboard() {
  const [ userData, setUserData ] = useState<any>('')
  const [ userArr, setUserArr ] = useState<any>('')

  const colorPercentage = (perc: number) => {
    if(perc > 85) return 'bg-green-300 border border-green-400'
    else if ( perc > 40 ) return 'bg-yellow-200 border border-yellow-300'
    else return 'bg-red-300 border border-red-400'
  }

  const [ activeContainer, setActiveContainer ] = useState<boolean>(false)
  const [ nameList, setNameList ] = useState<string>('')
  const [ peopleInvited, setPeopleInvited ] = useState<string>('')
  const [ peopleInvitedArr, setPeopleInvitedArr ] = useState<string[]>([])

  const [ creatingError, setCreatingError ] = useState('')
  const [ showAlert, setShowAlert ] = useState(false)

  const router = useRouter()
  const deleteUserListInvited = (nameUser: string) => {
    let indexUser = peopleInvitedArr.indexOf(nameUser)
    if(peopleInvitedArr.indexOf(nameUser) > -1) {
      let removedItem = [...peopleInvitedArr]
      removedItem.splice(indexUser, 1)
      setPeopleInvitedArr(removedItem)
    }
  }

  function validateListName(name: string): string | null {
    if (!name || name.trim().length === 0) return 'List name cannot be empty'
    if (name.trim().length < 2)            return 'List name must be at least 2 characters'
    return null
  }

  function validateInviteEmail(email: string): string | null {
    if (!email || email.trim().length === 0) return 'Email cannot be empty'
    if (!email.includes('@'))                return 'Email must contain @'
    const [local, domain] = email.split('@')
    if (!local || local.length === 0)        return 'Missing name before @'
    if (!domain || !domain.includes('.'))    return 'Domain must contain a dot (e.g. gmail.com)'
    const parts = domain.split('.')
    if (parts.some(p => p.length === 0))     return 'Domain is not valid'
    return null
  }

  const [nameListError, setNameListError]       = useState<string | null>(null)
  const [inviteEmailError, setInviteEmailError] = useState<string | null>(null)

  const addUserToList = (email: string) => {
    // Validar formato
    const emailError = validateInviteEmail(email)
    if (emailError) {
      setInviteEmailError(emailError)
      return
    }
    // No puede añadirse a sí mismo
    if (email.trim().toLowerCase() === userData.email.trim().toLowerCase()) {
      setInviteEmailError("You can't add your own email")
      return
    }
    // No duplicados
    if (peopleInvitedArr.includes(email.trim())) {
      setInviteEmailError('This email has already been added')
      return
    }
    setInviteEmailError(null)
    setPeopleInvitedArr([...peopleInvitedArr, email.trim()])
    setPeopleInvited('')
  }
const createDbData = async () => {
  // ── Validation ──
  const nameError = validateListName(nameList)
  if (nameError) {
    setNameListError(nameError)
    return
  }
  setNameListError(null)

  // ── Build data ──
  const dataDb: databaseDataCreation = {
    id: crypto.randomUUID(),
    name: nameList,
    people: [userData.email, ...peopleInvitedArr],
    itemsList: [],
    stockAvg: null
  }

  try {
    setCreatingError('Creating list...')
    setShowAlert(true)
    await addListDb(dataDb)
    setCreatingError('Redirecting...')
    setShowAlert(true)
    // reset form
    setNameList('')
    setPeopleInvitedArr([])
    setPeopleInvited('')
    setActiveContainer(false)

    setTimeout(() => {
      router.push(`list/${dataDb.id}`)
    }, 2000)

  } catch (err) {
    console.error(err)
    setCreatingError('Failed to create list')
    setShowAlert(true)
  }
}

  const [ arrEdit, setArrEdit ] = useState<any>()

  const [editNameError, setEditNameError]       = useState<string | null>(null)
  const [editInviteError, setEditInviteError]   = useState<string | null>(null)

  
  const editListDb = async () => {
    try {
      const supabase = createClient()
      await supabase
        .from('list-elements')
        .update({ name: arrEdit.name, people: arrEdit.people })
        .eq('id', arrEdit.id)

      setUserArr((prev: any) => prev.map((el: any) =>
        el.id === arrEdit.id ? { ...el, name: arrEdit.name, people: arrEdit.people } : el
      ))
      setArrEdit(null)
    } catch (err) {
      console.error(err)
    }
  }

  const [confirmDelete, setConfirmDelete] = useState<any>(null)

  const deleteListDb = async (listId: string) => {
  try {
    const supabase = createClient()
    await supabase
      .from('list-elements')
      .delete()
      .eq('id', listId)

    setUserArr((prev: any) => prev.filter((el: any) => el.id !== listId))
  } catch (err) {
    console.error(err)
  }
}


  useEffect(() => {
    const changeData = async () => {
      const userDataInfo = await UserLog()
      if (userDataInfo) {
        setUserData(userDataInfo)
      }
    }

    const getLists = async () => {
      const userDataArr = await UserArr()
      if(userDataArr) {
        setUserArr(userDataArr)
      }else {
        throw new Error('Sorry we couldnt find nothing')
      }
    }
    getLists()
    changeData()
  }, [])
  
  return (
    <>
    <HeaderDash />
    <main>
      <div>

        <div className="w-full flex justify-center items-center mt-12 mb-8"> {/* Top part */}
          <div className="w-[90%] max-w-300 flex justify-between items-end">
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">Your Lists</p>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{userArr.length} Lists</h1>
            </div>
            <button className="bg-gray-900 text-white px-5 h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer" onClick={()=> setActiveContainer(el => !el)}>
              <Image src={addIcon} alt="create" /> Create List
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-center"> {/* Container of elements */}
          <div className="w-[90%] max-w-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userArr ?
            <>
              {userArr.map((el: any, inx: number) => {
                return (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden" key={inx}>
                  <Link href={`list/${el.id}`} key={inx}>
                    <div className="p-6">
                      <h1 className="text-lg font-semibold text-gray-900 truncate">{el.name}</h1>
                      <div className="flex gap-8 mt-4">
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Products</p>
                          <p className="text-2xl font-bold text-gray-900 mt-0.5">{el.itemsList.length}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Members</p>
                          <p className="text-2xl font-bold text-gray-900 mt-0.5">{el.people.length}</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Mobile/tablet: botones abajo siempre visibles */}
                  <div className="flex gap-2 px-6 pb-5 lg:hidden border-t border-gray-100 pt-4">
                    <button className="p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors" onClick={() => setConfirmDelete(el)}>
                      <Image src={trashbag} alt="deleteTask" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setArrEdit(el)}>
                      <Image src={editIcon} alt="editTask" />
                    </button>
                  </div>

                  {/* Desktop: botones hover */}
                  <div className="hidden lg:flex absolute top-4 right-4 opacity-0 flex-col gap-2 transition-all duration-200 group-hover:opacity-100">
                    <button className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:border-red-200 cursor-pointer transition-colors" onClick={() => setConfirmDelete(el)}>
                      <Image src={trashbag} alt="deleteTask" />
                    </button>
                    <button className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => setArrEdit(el)}>
                      <Image src={editIcon} alt="editTask" />
                    </button>
                  </div>
                </div>
                )
              })}

              {arrEdit && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6 z-10 overflow-y-scroll sm:overflow-hidden">
                  <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">

                    <div className="mb-6">
                      <h1 className="text-xl font-semibold text-gray-900">Edit List</h1>
                      <p className="text-gray-400 mt-1 text-sm">Update name or members.</p>
                    </div>

                    <div className="space-y-5">

                      {/* ── List name ── */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">List name</label>
                        <input type="text" value={arrEdit.name} className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${editNameError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                          onChange={(e) => {
                            setArrEdit({ ...arrEdit, name: e.target.value })
                            if (editNameError) setEditNameError(validateListName(e.target.value))
                          }}
                          onBlur={() => setEditNameError(validateListName(arrEdit.name))}
                        />
                        {editNameError && (
                          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                            <span>⚠</span> {editNameError}
                          </p>
                        )}
                      </div>

                      {/* ── Members ── */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Members</p>
                        <div className="flex flex-col gap-2">
                          {arrEdit.people.map((person: string, _: number) => (
                            <div key={_} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                              <div className="flex items-center gap-2">
                                <Image src={userList} alt="user" width={18} />
                                <p className="text-sm text-gray-700">{person}</p>
                              </div>
                              {person !== userData.email && _ !== 0 && (
                                <div className="cursor-pointer p-1 rounded-lg hover:bg-red-50 transition-colors"
                                  onClick={() => setArrEdit({ ...arrEdit, people: arrEdit.people.filter((p: string) => p !== person) })}
                                >
                                  <Image src={trashbag} alt="remove" width={14} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* ── Add by email ── */}
                        <div className="flex gap-2 mt-3">
                          <input type="email" placeholder="Add by email" value={peopleInvited} className={`flex-1 h-10 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${editInviteError ? 'border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                            onChange={(e) => {
                              setPeopleInvited(e.target.value)
                              if (editInviteError) setEditInviteError(null)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const error = validateInviteEmail(peopleInvited)
                                if (error) { setEditInviteError(error); return }
                                if (peopleInvited.trim().toLowerCase() === userData.email.trim().toLowerCase()) {
                                  setEditInviteError("You can't add your own email"); return
                                }
                                if (arrEdit.people.includes(peopleInvited.trim())) {
                                  setEditInviteError('This email has already been added'); return
                                }
                                setEditInviteError(null)
                                setArrEdit({ ...arrEdit, people: [...arrEdit.people, peopleInvited.trim()] })
                                setPeopleInvited('')
                              }
                            }}
                          />
                          <button className="px-4 h-10 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors font-medium"
                            onClick={() => {
                              const error = validateInviteEmail(peopleInvited)
                              if (error) { setEditInviteError(error); return }
                              if (peopleInvited.trim().toLowerCase() === userData.email.trim().toLowerCase()) {
                                setEditInviteError("You can't add your own email"); return
                              }
                              if (arrEdit.people.includes(peopleInvited.trim())) {
                                setEditInviteError('This email has already been added'); return
                              }
                              setEditInviteError(null)
                              setArrEdit({ ...arrEdit, people: [...arrEdit.people, peopleInvited.trim()] })
                              setPeopleInvited('')
                            }}
                          >
                            Add
                          </button>
                        </div>

                        {editInviteError && (
                          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <span>⚠</span> {editInviteError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-gray-100">
                      <button className="px-5 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
                        onClick={() => { setArrEdit(null); setEditNameError(null); setEditInviteError(null) }}
                      >
                        Cancel
                      </button>
                      <button className="px-5 h-10 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors text-sm font-medium"
                        onClick={editListDb}
                      >
                        Save Changes
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {confirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6 z-20">
                  <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                    <div className="mb-6">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                        <Image src={trashbag} alt="delete" width={18} />
                      </div>
                      <h1 className="text-lg font-semibold text-gray-900">Delete List</h1>
                      <p className="text-gray-400 mt-1.5 text-sm">
                        Are you sure you want to delete <span className="font-medium text-gray-700">"{confirmDelete.name}"</span>? This can't be undone.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
                      <button className="px-5 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium" onClick={() => setConfirmDelete(null)}>
                        Cancel
                      </button>
                      <button className="px-5 h-10 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium" onClick={() => { deleteListDb(confirmDelete.id); setConfirmDelete(null) }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </>
            :
            <>
              <div className="w-full flex items-center justify-center py-20 absolute left-0">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-white shadow-inner">
                    <svg className="animate-spin w-10 h-10 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">Loading list</h2>
                    <p className="text-sm text-gray-400 mt-1">Fetching your items — this will only take a moment.</p>
                  </div>
                </div>
              </div>
            </>
            }
          </div>
        </div>

      </div>

      {/* Create list */}
      <div className={`w-full h-screen ${activeContainer ? 'flex' : 'hidden'} fixed inset-0 items-center justify-center bg-black/30 backdrop-blur-sm z-10`}>
        <div className="w-[95%] max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Create List</h1>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setActiveContainer(false)}>
              <Image src={closeIcon} alt="CloseX" />
            </button>
          </div>

          <div className="space-y-5">

            {/* ── List name ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${nameListError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                type="text" name="name" id="list-name" value={nameList}
                onChange={(e) => {
                  setNameList(e.target.value)
                  if (nameListError) setNameListError(validateListName(e.target.value))
                }}
                onBlur={() => setNameListError(validateListName(nameList))}
              />
              {nameListError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {nameListError}
                </p>
              )}
            </div>

            {/* ── Add people ── */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Add people</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3">
                    <Image src={addUser} alt="Add-user-icon" />
                  </span>
                  <input className={`w-full h-11 pl-10 pr-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${inviteEmailError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                    type="email" name="email-users" value={peopleInvited}
                    onChange={(e) => {
                      setPeopleInvited(e.target.value)
                      if (inviteEmailError) setInviteEmailError(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addUserToList(peopleInvited)
                      }
                    }}
                  />
                </div>
                <button type="button" className="px-4 h-11 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
                  onClick={() => addUserToList(peopleInvited)}
                >
                  Add
                </button>
              </div>

              {inviteEmailError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {inviteEmailError}
                </p>
              )}

              {/* ── People invited list ── */}
              <div className="mt-3 flex flex-col gap-2">
                {peopleInvitedArr.map((people: string, inx: number) => (
                  <div className="w-full h-11 flex items-center justify-between px-4 border border-gray-200 rounded-xl bg-gray-50" key={`${people}-${inx}`}>
                    <div className="flex items-center gap-2">
                      <Image src={userList} alt="userExample" width={18} height={18} />
                      <span className="text-sm text-gray-700">{people}</span>
                    </div>
                    <Image className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity" src={trashbag} alt="trashbag-deleteUser"
                      onClick={() => deleteUserListInvited(people)}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          <button onClick={createDbData} className="w-full h-11 mt-6 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
            Create List
          </button>

        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Notification</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{creatingError}</p>
          </div>
          <button onClick={()=> setShowAlert(false)} className="text-xs text-gray-400 hover:text-gray-700 transition-colors shrink-0">Close</button>
        </div>
      )}
    </main>
    </> 
  );
}
