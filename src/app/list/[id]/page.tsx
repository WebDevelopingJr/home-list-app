
"use client";

import { useParams } from "next/navigation";
import { createClient } from '../../databaseconfig/client-component'
import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { editList } from "../../databaseconfig/serverDb"
import Image from "next/image";
import Link from "next/link";
import { useIsMobile, ItemListDevice, ItemListPhone } from '../../list-items/listItems'
/* images */

import returnIcon from '../../../../public/dashboard-img/return-icon.png'
import editIconList from '../../../../public/lists-img/editList.png'
import deleteList from '../../../../public/lists-img/delete-icon.png'
import searchIcon from '../../../../public/lists-img/search-icon.png'
import addImgIcon from '../../../../public/lists-img/addImg-icon.png'
import filterIcon from '../../../../public/lists-img/filter-icon.png'
import closeIcon from '../../../../public/lists-img/close-icon.png'
import imageCreateIcon from '../../../../public/lists-img/imageCreate-icon.png'
import openImageIcon from '../../../../public/lists-img/openImage-icon.png'
import highItem from '../../../../public/lists-img/check-aviable.png'
import lowItem from '../../../../public/lists-img/lowStock-icon.png'
import noStockItem from '../../../../public/lists-img/noStock-icon.png'

import defaultImage from '../../../../public/lists-img/default-img.png'


type CheckElements = 'styles' | 'images'
type StateAviable = 'Aviable' | 'Low stock' | 'No stock'

type ListDb = {
  id: ReturnType<typeof crypto.randomUUID>,
  name: string,
  type: string,
  brand: string | null,
  store?: string,
  image?: string,
  amount: number,
  maxAmount: number,
  avb: StateAviable
}
export default function ListDetail() {

  const params = useParams();
  const [ arrInfo, setArrInfo ] = useState<any>('')

  const giveStockDeclarations = (stateAvb: StateAviable, typeReturn: CheckElements) => {
    if(typeReturn == 'styles') {
      if(stateAvb == 'Aviable') return 'bg-green-300 rounded-lg border border-green-400 text-green-600'
      else if(stateAvb == 'Low stock') return 'bg-yellow-200 rounded-lg border border-yellow-300 text-yellow-600'
      else return 'bg-red-300 rounded-lg border border-red-400 text-red-500'
    }else {
      if(stateAvb == 'Aviable') return highItem
      else if(stateAvb == 'Low stock') return lowItem
      else return noStockItem
    }
  }

  const giveBarStyles = (state: StateAviable) => {
    if(state == 'Aviable') return 'bg-linear-to-r from-green-400/60 via-green-400/60 to-green-500/60'
    else if(state == 'Low stock') return 'bg-linear-to-r from-yellow-400/70 via-yellow-400/70 to-yellow-500/70'
    else return 'bg-linear-to-r from-red-400/70 via-red-400/70 to-red-500/70'
  }
  const [ dataArrList, setDataArrList ] = useState<ListDb[]>([])
  
  const [ showArrList, setShowArrList ] = useState<ListDb[]>([])


  const [ openDiv, setOpenDiv ] = useState<boolean>(false)
  /* Name, type, brand, amount, aviability */
  const [ proName, setProName ] = useState('')
  const [ proType, setProType ] =  useState('')
  const [ proBrand, setProBrand ] = useState('')
  const [ proStore, setProStore ] = useState('')
  const [ proAmount, setProAmount] = useState<number>()
  const [ proMaxAmount, setProMaxAmount] = useState<number>()
  const [ proAvb, setProAvb ] = useState<StateAviable>()

  /* Errors */
  const [proNameError, setProNameError] = useState<string | null>(null)
  const [proTypeError, setProTypeError] = useState<string | null>(null)
  const [proAmountError, setProAmountError] = useState<string | null>(null)
  const [proMaxAmountError, setProMaxAmountError] = useState<string | null>(null)
  const [proAvbError, setProAvbError] = useState<string | null>(null)

  function validateProductName(name: string): string | null {
    if (!name || name.trim().length === 0) return 'Product name cannot be empty'
    if (name.trim().length < 2)            return 'Product name must be at least 2 characters'
    return null
  }

  function validateProductType(type: string): string | null {
    if (!type || type.trim().length === 0) return 'Product type cannot be empty'
    if (type.trim().length < 2)            return 'Product type must be at least 2 characters'
    return null
  }

  function validateProductAmount(amount: number | undefined): string | null {
    if (amount === undefined || amount === null) return 'Quantity is required'
    if (amount < 0)                             return 'Quantity cannot be negative'
    return null
  }

  function validateProductMaxAmount(max: number | undefined, amount: number | undefined): string | null {
    if (max === undefined || max === null) return 'Capacity is required'
    if (max <= 0)                          return 'Capacity must be greater than 0'
    if (amount !== undefined && max < amount) return 'Capacity cannot be less than quantity'
    return null
  }

  function validateProductAvb(avb: string | undefined): string | null {
    if (!avb) return 'Please select an initial stock status'
    return null
  }


  const createProductList = async () => {
    // ── Validation ──
    const nameError = validateProductName(proName)
    const typeError = validateProductType(proType)

    const amountError = validateProductAmount(proAmount)
    const maxAmountError = validateProductMaxAmount(proMaxAmount, proAmount)
    const avbError = validateProductAvb(proAvb)

    setProNameError(nameError)
    setProTypeError(typeError)
    setProAmountError(amountError)
    setProMaxAmountError(maxAmountError)
    setProAvbError(avbError)

    if (nameError || typeError || amountError || maxAmountError || avbError) return

    const dataList: ListDb = {
      id: crypto.randomUUID(),
      name: proName,
      type: proType,
      brand: proBrand,
      store: proStore,
      amount: proAmount!,
      maxAmount: proMaxAmount!,
      avb: proAvb!
    }

    const dataListArr: ListDb[] = [...dataArrList, dataList]
    try {
      await editList(params.id, dataListArr)
      setDataArrList([...dataArrList, dataList])
      setShowArrList([...dataArrList, dataList])
      // reset
      setProName(''); setProType(''); setProBrand('')
      setProStore(''); setProAmount(undefined)
      setProMaxAmount(undefined); setProAvb(undefined)
      setOpenDiv(false)
    } catch (error) {
      console.error(error)
    }
  }


  const isMobile = useIsMobile()


  const deleteListElement = async (listInx: ReturnType<typeof crypto.randomUUID>) => {
    const answList: ListDb[] = dataArrList.filter((el, inx) => el.id !== listInx)
    setShowArrList(answList)
    setDataArrList(answList)
    await editList(params.id, answList)
    
  } 
  

  const separateTypes = (filterCat: string): string[] => {
    const typesAnsw: string[] = []
    if(filterCat == 'type') {
      dataArrList.forEach((el) => {
      if(typesAnsw.includes(el.type) == false) {
        typesAnsw.push(el.type)
      }
    })
    }else if(filterCat == 'brand') {
      dataArrList.forEach((el) => {
        if(el.brand !== null && el.brand !== '') {
          if(typesAnsw.includes(el.brand) == false) {
            typesAnsw.push(el.brand)
          }
        }
    })
    }else {
      dataArrList.forEach((el) => {
        if('store' in el && el.store !== undefined) {
          if(el.store && typesAnsw.includes(el.store) == false) {
            typesAnsw.push(el.store)
          }
        }
    })
    }
    return typesAnsw
  }

  const [ showEditPanel, setShowEditPanel ] = useState<[boolean, ListDb | null]>([false, null])
  const [ itemToEdit, setItemToEdit ] = useState<ListDb | null>()

  const [ moreEditInfo, setMoreEditInfo ] = useState<boolean>(false)

  const editItemList = async (elementId: ReturnType<typeof crypto.randomUUID>) => {
    const answFilter: any = dataArrList.map((el) => {
      if(el.id == elementId) { 
        return itemToEdit
      }
      return el
    })
    setShowEditPanel([false, null])
    setShowArrList(answFilter)
    setDataArrList(answFilter)
    setMoreEditInfo(false)

    try {
      await editList(params.id, answFilter)
    }catch(error) {
      console.error(error)
    }
  }


  const filterItems = (nameItem: string) => {
    const dataFiltered = dataArrList.filter((el)=> {
      if(el.name.toLowerCase().includes(nameItem.toLowerCase())) {
        return el
      }
    })
    setShowArrList(dataFiltered)

  } 
  
  const [ showFilterContainer, setShowFilterContainer ] = useState<boolean>(false)

  const [ filtCat, setFitlCat ] = useState('')
  const [ filtState, setFiltState ] = useState<StateAviable | ''>('')
  const [ filtStore, setFiltStore ] = useState('')
  const [ filtBrand, setFiltBrand ] = useState('')
  
  const filterCategory = () => {
    const filtArr = dataArrList.filter((el) => {
      if((el.type == filtCat || filtCat == '') && (el.avb == filtState || filtState == '') && (el.brand == filtBrand || filtBrand == '') && ('store' in el && el.store == filtStore || filtStore == '')) {
        return el
      }
    })
    
    setShowArrList(filtArr)
    setShowFilterContainer(false)
  }


  /* fast filter  */

  const fastFilter = (stateFilter: StateAviable | '') => {
    setFiltState(stateFilter)
    if(filtState) {
      filterCategory()
    }
  }
  /* UPLOAD IMAGE */
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)


  const [ elementListImage, setElementListImage ] = useState<ListDb | null>()

const addImageLink = async (id: string, targetElement: ListDb) => {
  const listWithImage = { ...targetElement, image: id }

  const answFilterImage: any = dataArrList.map((el) => {
    if (el.id == targetElement.id) {
      return listWithImage
    }
    return el
  })

  try {
    await editList(params.id, answFilterImage)
    setDataArrList(answFilterImage)
    setShowArrList(answFilterImage)
  } catch (error) {
    console.error(error)
  }
}

  
  const [ showImagePanel, setShowImagePanel ] = useState(false)
  const [ uploadingImage, setUploadingImage ] = useState<boolean>(false)

  async function uploadImage(file: File) {
    const currentElement = elementListImage
    if (!currentElement) return

    const supabase = createClient()
    const randomImgId = crypto.randomUUID()
    setUploadingImage(true)

    const { data, error } = await supabase
      .storage
      .from('listItems')
      .upload(arrInfo.id + '/' + randomImgId, file)

    if (data) {
      await addImageLink(randomImgId, currentElement)
      setElementListImage(null)
      setShowImagePanel(false)
      setPendingFile(null)
    } else {
      console.error(error)
    }
    setUploadingImage(false)
  }


  const [ imageOpen, setImageOpen ] = useState<string>()
  const [ openImageContainer, setOpenImageContainer ] = useState<boolean>(false)

  const replaceImage = async (file: File, targetElement: ListDb) => {
    const supabase = createClient()
    const currentDataArr = dataArrList  // Captura ANTES del await

    if (targetElement.image) {
      await supabase.storage
        .from('listItems')
        .remove([`${arrInfo.id}/${targetElement.image}`])
    }

    const newImageId = crypto.randomUUID()
    const { data, error } = await supabase.storage
      .from('listItems')
      .upload(`${arrInfo.id}/${newImageId}`, file)

    if (error) { console.error(error); return }

    const listWithImage = { ...targetElement, image: newImageId }
    const answFilterImage = currentDataArr.map((el) =>
      el.id === targetElement.id ? listWithImage : el
    )

    try {
      await editList(params.id, answFilterImage)
      setDataArrList(answFilterImage)
      setShowArrList(answFilterImage)
      setItemToEdit(listWithImage)
    } catch (error) {
      console.error(error)
    }
  }
  

  const [deletingImage, setDeletingImage] = useState(false)
  
  const deleteImage = async (targetElement: ListDb) => {
    const supabase = createClient()
    const currentDataArr = dataArrList
    setDeletingImage(true)

    if (targetElement.image) {
      await supabase.storage
        .from('listItems')
        .remove([`${arrInfo.id}/${targetElement.image}`])
    }

    const listWithoutImage = { ...targetElement, image: undefined }
    const answFilter = currentDataArr.map((el) =>
      el.id === targetElement.id ? listWithoutImage : el
    )

    try {
      await editList(params.id, answFilter)
      setDataArrList(answFilter)
      setShowArrList(answFilter)
      setItemToEdit(listWithoutImage)
    } catch (error) {
      console.error(error)
    }
    setDeletingImage(false)
  }

  /* Edit people from arr */
  const [peopleArr, setPeopleArr] = useState<string[]>(arrInfo.people ?? [])
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  const addPerson = () => {
    const trimmed = newEmail.trim().toLowerCase()
    if (!trimmed) { setEmailError('Enter an email'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setEmailError('Invalid email'); return }
    if (peopleArr.includes(trimmed)) { setEmailError('Already added'); return }
    setPeopleArr(prev => [...prev, trimmed])
    setNewEmail('')
    setEmailError(null)
  }

  const removePerson = (email: string) => {
    setPeopleArr(prev => prev.filter(p => p !== email))
  }

  const editListDb = async () => {
    try {
      const supabase = createClient()
      await supabase
        .from('list-elements')
        .update({ people: peopleArr })
        .eq('id', params?.id)
    } catch (err) {
      console.error(err)
    }
  }



  /* Functions lists */
  const itemProps = {
    showArrList,
    arrInfo,
    setImageOpen,
    setOpenImageContainer,
    setShowImagePanel,
    setElementListImage,
    setItemToEdit,
    setShowEditPanel,
    deleteListElement,
    giveStockDeclarations,
    giveBarStyles,
    defaultImage,
    openImageIcon,
    addImgIcon,
    editIconList,
    deleteList,
  }
  
  useEffect(()=>{

    const callDataArr = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('list-elements')
        .select('*')
        .eq('id', params?.id)
      
        if(data) {
          setArrInfo(data[0])
          setDataArrList(data[0].itemsList)
          setShowArrList(data[0].itemsList)
        }
    }

    callDataArr()
  },[])
  return (
    <>
    {arrInfo && dataArrList ? 
    <>
      {/* Header */}
      <div className="w-full flex justify-center items-center pt-8 pb-8 bg-[#1b345f]">
        <div className="w-[90%] max-w-500 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={'/dashboard'}><div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"><Image src={returnIcon} alt="returnDashboard" /></div></Link>
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-0.5">List</p>
              <h1 className="text-2xl font-semibold text-white tracking-tight">{arrInfo.name}</h1>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 h-10 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Share</button>
            <button className="px-4 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer" onClick={()=> setOpenDiv(true)}>+ Add Product</button>
          </div>
        </div>
      </div>

      {/* Sticky search + filter bar */}
      <div className="w-full flex items-center justify-center sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-3">
        <div className="w-[90%] max-w-500 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-700 hidden sm:block">{dataArrList.length} items</p>
          <div className="flex gap-2 ml-auto">
            <div className="flex items-center justify-center relative">
              <Image src={searchIcon} alt="search" className="absolute left-3 w-4 h-4"/>
              <input type="text" placeholder="Search products..." className="w-56 h-10 border border-gray-200 bg-gray-50 pl-9 pr-4 rounded-xl text-sm outline-none focus:border-gray-400 focus:bg-white transition sm:w-72"
                onChange={(e)=> filterItems(e.target.value)} />
            </div>
            <button className="h-10 px-4 flex items-center gap-2 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={()=> setShowFilterContainer((el) => !el)}>
              <Image src={filterIcon} alt="filter_icon" className="w-4 h-4"/> Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className={`bg-white border border-gray-200 rounded-2xl shadow-xl p-6 w-full max-w-xl fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showFilterContainer ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-gray-900">Filters</p>
          <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            onClick={()=> { setFitlCat(''); setFiltState(''); setFiltBrand('') }}>
            Clear all
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">Category</p>
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtCat == '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFitlCat('')}>All</div>
              {separateTypes('type').map((el, _) => (
                <div key={`${el}-${_}`} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtCat == el ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFitlCat(el)}>{el}</div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">Status</p>
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtState == '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFiltState('')}>All</div>
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtState == 'Aviable' ? 'bg-green-600 text-white border-green-600' : 'bg-green-50 border-green-200 text-green-700 hover:border-green-400'}`} onClick={()=> setFiltState('Aviable')}>Available</div>
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtState == 'Low stock' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:border-yellow-400'}`} onClick={()=> setFiltState('Low stock')}>Low stock</div>
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtState == 'No stock' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 border-red-200 text-red-700 hover:border-red-400'}`} onClick={()=> setFiltState('No stock')}>No stock</div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">Brand</p>
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtBrand == '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFiltBrand('')}>All</div>
              {separateTypes('brand').map((el, _) => (
                <div key={`${el}-${_}`} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtBrand == el ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFiltBrand(el)}>{el}</div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2.5">Store</p>
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtStore == '' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFiltStore('')}>All</div>
              {separateTypes('store').map((el, _) => (
                <div key={`${el}-${_}`} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${filtStore == el ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`} onClick={()=> setFiltStore(el)}>{el}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 mt-6 pt-5 border-t border-gray-100">
          <button className="px-5 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={()=> setShowFilterContainer(false)}>Close</button>
          <button className="px-5 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            onClick={()=> filterCategory()}>Apply filters</button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-col gap-6 mt-6">
        {/* Quick status filter chips */}
        <div className="w-[90%] max-w-7xl flex items-center justify-between flex-wrap gap-5">
          <div className="flex gap-2 flex-wrap">
            <div className={`h-8 px-4 text-xs font-medium flex items-center rounded-lg border cursor-pointer transition-all ${filtState === '' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}
              onClick={()=> { fastFilter('') }}>All</div>
            <div className={`h-8 px-4 text-xs font-medium flex items-center rounded-lg border cursor-pointer transition-all ${filtState === 'Aviable' ? 'bg-green-600 border-green-600 text-white' : 'bg-green-50 border-green-200 text-green-700 hover:border-green-400'}`}
              onClick={()=> { fastFilter('Aviable') }}>Available</div>
            <div className={`h-8 px-4 text-xs font-medium flex items-center rounded-lg border cursor-pointer transition-all ${filtState === 'Low stock' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:border-yellow-400'}`}
              onClick={()=> { fastFilter('Low stock') }}>Low stock</div>
            <div className={`h-8 px-4 text-xs font-medium flex items-center rounded-lg border cursor-pointer transition-all ${filtState === 'No stock' ? 'bg-red-600 border-red-600 text-white' : 'bg-red-50 border-red-200 text-red-700 hover:border-red-400'}`}
              onClick={()=> { fastFilter('No stock') }}>No stock</div>
          </div>
          {/* <button className="h-8 px-4 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors block"
            onClick={()=> filterCategory()}>Apply</button> */}
        </div>

        {/* Items table */}
        <div className="w-[90%] max-w-7xl rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          {isMobile ? <ItemListPhone {...itemProps} /> : <ItemListDevice {...itemProps} />}
          {showArrList.length == 0 &&
            <div className="w-full flex flex-col items-center justify-center py-20 px-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-900">No items yet</h2>
              <p className="text-sm text-gray-400 mt-1 text-center max-w-xs">Click "Add Product" to start building your inventory.</p>
            </div>
          }
        </div>

        {/* Edit panel */}
        {showEditPanel[0] && itemToEdit &&
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm p-6 z-10 overflow-scroll sm:overflow-hidden">
            <div className="w-full max-w-2xl bg-white shadow-2xl border border-gray-200 p-8 absolute top-0 sm:relative sm:top-auto sm:rounded-2xl">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Edit Item</h1>
                  <p className="text-sm text-gray-400 mt-0.5">Update inventory information.</p>
                </div>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  onClick={()=> { setItemToEdit(null); setShowEditPanel([false, null]); setMoreEditInfo(false) }}>
                  <Image src={closeIcon} alt="close" />
                </button>
              </div>

              <div className="space-y-5">
                {moreEditInfo &&
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input type="text" value={itemToEdit.name} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                      onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <input type="text" value={itemToEdit.type} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                        onChange={(e) => setItemToEdit({ ...itemToEdit, type: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                      <input type="text" value={itemToEdit.brand || ""} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                        onChange={(e) => setItemToEdit({ ...itemToEdit, brand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Location</label>
                    <input type="text" value={itemToEdit.store || ""} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                      onChange={(e) => setItemToEdit({ ...itemToEdit, store: e.target.value })}
                    />
                  </div>

                  {itemToEdit.image && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <img src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${itemToEdit.image}`}
                        className={`w-14 h-14 rounded-xl object-cover transition ${deletingImage ? 'opacity-40' : ''}`} alt="product" />
                      <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium text-gray-700">Current image</p>
                        {deletingImage ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <p className="text-xs text-red-400">Deleting...</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <label className="text-xs text-blue-500 cursor-pointer hover:text-blue-600 font-medium">
                              Replace
                              <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden"
                                onChange={(e) => { const file = e.target.files?.[0]; if (file) replaceImage(file, itemToEdit) }}
                              />
                            </label>
                            <span className="text-gray-300">·</span>
                            <button className="text-xs text-red-500 hover:text-red-600 font-medium" onClick={() => deleteImage(itemToEdit)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input type="number" value={itemToEdit.amount} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                      onChange={(e) => setItemToEdit({ ...itemToEdit, amount: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input type="number" value={itemToEdit.maxAmount} className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                      onChange={(e) => setItemToEdit({ ...itemToEdit, maxAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Stock Status</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button type="button"
                      onClick={() => { setProAvb("Aviable"); setItemToEdit({ ...itemToEdit, avb: 'Aviable' }) }}
                      className={`h-20 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 text-sm font-medium ${itemToEdit.avb == 'Aviable' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Image src={highItem} alt="" width={24} />Available
                    </button>
                    <button type="button"
                      onClick={() => { setProAvb("Low stock"); setItemToEdit({ ...itemToEdit, avb: 'Low stock' }) }}
                      className={`h-20 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 text-sm font-medium ${itemToEdit.avb == 'Low stock' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Image src={lowItem} alt="" width={24} />Low Stock
                    </button>
                    <button type="button"
                      onClick={() => { setProAvb("No stock"); setItemToEdit({ ...itemToEdit, avb: 'No stock' }) }}
                      className={`h-20 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 text-sm font-medium ${itemToEdit.avb == 'No stock' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Image src={noStockItem} alt="" width={24} />No Stock
                    </button>
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-5 border-t border-gray-100 flex-col sm:flex-row">
                  <button className="px-4 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={()=> setMoreEditInfo((el) => !el)}>{moreEditInfo ? 'Less details' : 'More details'}</button>
                  <div className="flex gap-2">
                    <button className="px-5 h-10 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                      onClick={()=> { setItemToEdit(null); setShowEditPanel([false, null]); setMoreEditInfo(false) }}>Cancel</button>
                    <button className="px-5 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                      onClick={()=> editItemList(itemToEdit.id)}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Create Item modal */}
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm ${openDiv ? 'flex' : 'hidden'} items-center justify-center z-10 sm:p-4 overflow-scroll sm:overflow-hidden`}>
        <div className="w-full max-w-xl bg-white shadow-2xl border border-gray-200 p-8 sm:rounded-2xl absolute top-0 sm:relative sm:top-auto">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Add Product</h1>
              <p className="text-sm text-gray-400 mt-0.5">Fill in the details below.</p>
            </div>
            <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              onClick={() => { setOpenDiv(false); setProNameError(null); setProAmountError(null); setProTypeError(null); setProMaxAmountError(null); setProAvbError(null) }}>
              <Image src={closeIcon} alt="close" />
            </button>
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input type="text" name="name" className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${proNameError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                placeholder="e.g. Olive oil 500ml" value={proName}
                onChange={(e) => { setProName(e.target.value); if (proNameError) setProNameError(validateProductName(e.target.value)) }}
                onBlur={() => setProNameError(validateProductName(proName))}
              />
              {proNameError && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {proNameError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
              <input type="text" name="type-item" className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${proTypeError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                placeholder="e.g. Food" value={proType}
                onChange={(e) => { setProType(e.target.value); if (proTypeError) setProTypeError(validateProductType(e.target.value)) }}
                onBlur={() => setProTypeError(validateProductType(proType))}
              />
              {proTypeError && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {proTypeError}</p>}
            </div>

            {separateTypes('type').length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Existing types</p>
                <div className="flex gap-2 flex-wrap">
                  {separateTypes('type').map((el, _) => (
                    <div key={`${el}-${_}`} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${proType === el ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'}`}
                      onClick={() => { setProType(el); if (proTypeError) setProTypeError(validateProductType(el)) }}>{el}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" name="brand" className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                  placeholder="e.g. Kirkland" value={proBrand}
                  onChange={(e) => { setProBrand(e.target.value) }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" name="store" className="w-full h-11 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none transition text-sm"
                  placeholder="e.g. Costco" value={proStore}
                  onChange={(e) => setProStore(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input type="number" name="amount" className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${proAmountError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                  placeholder="0"
                  onChange={(e) => { setProAmount(Number(e.target.value)); if (proAmountError) setProAmountError(validateProductAmount(Number(e.target.value))) }}
                  onBlur={() => setProAmountError(validateProductAmount(proAmount))}
                />
                {proAmountError && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {proAmountError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input type="number" name="maxAmount" className={`w-full h-11 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${proMaxAmountError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
                  placeholder="100"
                  onChange={(e) => { setProMaxAmount(Number(e.target.value)); if (proMaxAmountError) setProMaxAmountError(validateProductMaxAmount(Number(e.target.value), proAmount)) }}
                  onBlur={() => setProMaxAmountError(validateProductMaxAmount(proMaxAmount, proAmount))}
                />
                {proMaxAmountError && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {proMaxAmountError}</p>}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Initial Status</p>
              <div className="grid grid-cols-3 gap-3">
                <div className={`h-20 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all text-sm font-medium gap-2 ${proAvb === 'Aviable' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => { setProAvb('Aviable'); setProAvbError(null) }}>
                  <Image src={highItem} alt="aviable" width={22} />Available
                </div>
                <div className={`h-20 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all text-sm font-medium gap-2 ${proAvb === 'Low stock' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => { setProAvb('Low stock'); setProAvbError(null) }}>
                  <Image src={lowItem} alt="lowStock" width={22} />Low Stock
                </div>
                <div className={`h-20 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all text-sm font-medium gap-2 ${proAvb === 'No stock' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  onClick={() => { setProAvb('No stock'); setProAvbError(null) }}>
                  <Image src={noStockItem} alt="noStock" width={22} />No Stock
                </div>
              </div>
              {proAvbError && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {proAvbError}</p>}
            </div>

          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
            <button className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => { setOpenDiv(false); setProNameError(null); setProAmountError(null); setProTypeError(null); setProMaxAmountError(null); setProAvbError(null) }}>
              Cancel
            </button>
            <button className="flex-1 h-11 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
              onClick={createProductList}>
              Create Product
            </button>
          </div>
        </div>
      </div>
      

      {/* Share to people div */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

        <div className="mb-5">
          <h1 className="text-base font-semibold text-gray-900">Members</h1>
          <p className="text-xs text-gray-400 mt-0.5">Add or remove people from this list.</p>
        </div>

        {/* Member list */}
        <div className="flex flex-col gap-2 mb-4">
          {peopleArr.map((el, _) => (
            <div key={`${el}-${_}`} className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-sky-600">{el[0].toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-700 truncate">{el}</p>
              </div>
              {_ !== 0 && (
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-300 transition-colors"
                  onClick={() => removePerson(el)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add email input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input type="email" placeholder="Add by email" value={newEmail} className={`w-full h-10 px-4 rounded-xl bg-gray-50 border outline-none transition text-sm ${emailError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-gray-400 focus:bg-white'}`}
              onChange={(e) => { setNewEmail(e.target.value); if (emailError) setEmailError(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPerson() } }}
            />
          </div>
          <button className="h-10 px-4 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
            onClick={addPerson}>
            Add
          </button>
        </div>

        {emailError && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {emailError}</p>
        )}

        {/* Save */}
        <button className="w-full h-10 mt-5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          onClick={editListDb}>
          Save changes
        </button>

      </div>

      {/* Upload Image modal */}
      {showImagePanel &&
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <p className="font-semibold text-gray-900">Upload image</p>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => { setShowImagePanel(false); setPendingFile(null) }}>
                <Image src={closeIcon} alt="closeContainer" />
              </button>
            </div>

            <div className="p-6">
              <div className={`rounded-2xl border-2 border-dashed px-6 py-12 transition-colors cursor-pointer ${pendingFile ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-gray-50 hover:border-gray-400'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  const allowed = ['image/png', 'image/jpeg', 'image/webp']
                  if (file && allowed.includes(file.type)) { setPendingFile(file) } else { alert('PNG, JPG or WEBP only') }
                }}
              >
                <div className="flex flex-col items-center justify-center text-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm">
                    <Image src={imageCreateIcon} alt="CreateIcon" />
                  </div>
                  {pendingFile ? (
                    <div>
                      <p className="font-semibold text-gray-900">{pendingFile.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Ready to upload</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-900">Drop your image here</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                  <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" ref={fileInputRef}
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) setPendingFile(file) }}
                  />
                  <button className="h-9 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => fileInputRef.current?.click()}>Browse files</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 px-6 py-5 justify-end">
              <button className="px-5 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => { setShowImagePanel(false); setPendingFile(null) }}>Cancel</button>
              <button className={`px-5 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium transition-colors ${!pendingFile ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                disabled={!pendingFile} onClick={() => pendingFile && uploadImage(pendingFile)}>
                {uploadingImage ? 'Uploading...' : 'Save image'}
              </button>
            </div>
          </div>
        </div>
      }

      {/* Full screen image viewer */}
      {openImageContainer && imageOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/80 p-4"
          onClick={() => { setOpenImageContainer(false); setImageOpen(undefined) }}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10 cursor-pointer"
              onClick={() => { setOpenImageContainer(false); setImageOpen(undefined) }}>
              <Image src={closeIcon} alt="close" />
            </button>
            <img src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${imageOpen}`}
              alt="product" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
      
    </>
    :
    <>
      <div className="w-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-100 border border-gray-200">
            <svg className="animate-spin w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base font-semibold text-gray-900">Loading</h2>
            <p className="text-sm text-gray-400 mt-0.5">Fetching your items...</p>
          </div>
        </div>
      </div>
    </>
    }
    </>
  );
}