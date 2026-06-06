
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
      <div className="w-full flex justify-center items-center mt-5"> {/* Header */}
        <div className="w-[90%] max-w-500 flex flex-col justify-between items-start gap-8 border-b border-gray-400 pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center justify-center gap-5">
            <Link href={'/dashboard'}><div className="size-9 flex items-center justify-center rounded-2xl bg-gray-400/50"><Image src={returnIcon} alt="returnDashboard" /></div></Link> {/* Button */}
            <div>
              <h1 className="text-2xl">{arrInfo.name}</h1>
              <p className="text-sm">{dataArrList.length} ITEMS</p>
            </div>
          </div>
          
          <div className="flex gap-5">
            <button className="w-25 h-10 bg-black text-white rounded-lg cursor-pointer hover:bg-gray-900 transition duration-100">Share</button>
            <button className="w-43 h-10 bg-gray-200 text-black border border-gray-400 rounded-lg cursor-pointer hover:bg-gray-900 hover:text-white transition duration-100" onClick={()=> setOpenDiv(true)}>Add a Product</button>
          </div>
        </div>
      </div>


      <div className="w-full flex items-center justify-center sticky pt-6 top-0 z-2 backdrop-blur-2xl"> {/* sticky positin items */}
        <div className="w-[90%] max-w-500 flex items-center justify-end pb-5">
          <div className="flex gap-3">
            <div className="flex items-center justify-center relative">
              <Image src={searchIcon} alt="search" className="absolute left-2"/>
              <input type="text" placeholder="Search" className="w-65 border border-gray-500 pl-10 py-1.5 rounded-2xl sm:w-70" onChange={(e)=> filterItems(e.target.value)} />
            </div>

            <button className="flex items-center justify-center gap-2 border border-gray-500 px-5 rounded-2xl hover:bg-gray-200 transition duration-200" onClick={()=> setShowFilterContainer((el) => !el)}><Image src={filterIcon} alt="filter_icon"/> Filter</button>
          </div>
        </div>
    </div>

    <div className={`bg-white/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 w-full max-w-2xl fixed z-10 top-1/2 left-1/2 transform -translate-1/2 ${showFilterContainer ? 'block' : 'hidden'} `}>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Image src={filterIcon} alt="filterIcon" className="w-4 h-4 opacity-70" />
          <p className="font-medium text-base">Filter</p>
        </div>
        <button className="text-sm border border-black/50 rounded-lg px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
        onClick={()=> {
          setFitlCat('')
          setFiltState('')
          setFiltBrand('')
        }}>
          Clear everything
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3">Category</p>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtCat == ' ' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFitlCat('')}>All</div>
            {separateTypes('type').map((el, _) => (
              <div key={`${el}-${_}`} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtCat == el ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors"`}  onClick={()=> setFitlCat(el)}>
                {el}
              </div>
            ))}
          </div>
        </div>
          
        <div className="h-px bg-black/70" />
          
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3`}>States</p>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltState('')}>All</div>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtState == 'Aviable' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer transition-colors`} onClick={()=> setFiltState('Aviable')}>Aviable</div>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtState == 'Low stock' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltState('Low stock')}>Low stock</div>
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtState == 'No stock' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltState('No stock')}>No stock</div>
          </div>
        </div>
          
        <div className="h-px bg-black/70" />
          
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3">Brand</p>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtBrand == ' ' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltBrand('')}>All</div>
            {separateTypes('brand').map((el, _) => (
              <div key={`${el}-${_}`} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtBrand == el ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltBrand(el)}>
                {el}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-black/70" />
          
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3">Store</p>
          <div className="flex flex-wrap gap-2">
            <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtStore == ' ' ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltStore('')}>All</div>
            {separateTypes('store').map((el, _) => (
              <div key={`${el}-${_}`} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-black/50 ${filtStore == el ? 'bg-gray-500 text-white' : ''} text-sm cursor-pointer hover:bg-white/10 transition-colors`} onClick={()=> setFiltStore(el)}>
                {el}
              </div>
            ))}
          </div>
        </div>
      </div>
          
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-black/60">
        <button className="text-sm border border-black/50 rounded-lg px-5 py-2 transition-colors hover:bg-red-500 hover:text-white cursor-pointer" onClick={()=> setShowFilterContainer(false)}>
          Close
        </button>

        <button className="text-sm border border-black/50 rounded-lg px-5 py-2 hover:bg-white/10 transition-colors cursor-pointer" onClick={()=> filterCategory()}>
          Apply
        </button>
      </div>
          
    </div>

      <div className="flex items-center justify-center mt-10">
        <div className="w-[90%] max-w-7xl flex flex-col border border-gray-400/60 border-t-0 rounded-2xl overflow-hidden">
          {isMobile ? <ItemListPhone {...itemProps} /> : <ItemListDevice {...itemProps} />}
          {showArrList.length == 0 ? 
          <>
            <div className="w-full flex flex-col items-center justify-center py-20 px-6">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">Create your first item</h2>
                  <p className="text-gray-500 max-w-sm">Start building your inventory. Click "Add a Product" above to create your first item and manage it effortlessly.</p>
                </div>
              </div>
            </div>
          </>
          :
          <>
          </>
          }
        </div>
        {showEditPanel[0] && itemToEdit? 
        
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm p-6 z-10 overflow-scroll sm:overflow-hidden">
            <div className="w-full max-w-3xl bg-white shadow-xl border border-zinc-200 p-8 absolute top-0 sm:relative sm:top-auto sm:rounded-3xl">

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-zinc-900">
                  Edit Item
                </h1>
                <p className="text-zinc-500 mt-1">
                  Update your inventory information.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">

              { moreEditInfo ? 
              <>
              <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={itemToEdit.name}
                    className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                    onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Product Type
                    </label>
                    <input
                      type="text"
                      value={itemToEdit.type}
                      className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                      onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        type: e.target.value
                      })
                    }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Product Brand
                    </label>
                    <input
                      type="text"
                      value={itemToEdit.brand || ""}
                      className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                      onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        brand: e.target.value
                      })
                    }
                    />
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Purchase Location
                    </label>
                    <input
                      type="text"
                      value={itemToEdit.store || ""}
                      className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                      onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        store: e.target.value
                      })
                    }
                    />
                  </div>
                {itemToEdit.image && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <img
                      src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${itemToEdit.image}`}
                      className={`w-16 h-16 rounded-xl object-cover transition ${deletingImage ? 'opacity-40' : ''}`}
                      alt="product"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-zinc-700">Current image</p>
                      {deletingImage ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <p className="text-sm text-red-400">Deleting picture...</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-blue-500 cursor-pointer hover:text-blue-600">
                            Replace image
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) replaceImage(file, itemToEdit)
                              }}
                            />
                          </label>
                          <div className="cursor-pointer" onClick={() => deleteImage(itemToEdit)}>
                            <Image src={deleteList} alt="deleteImage" width={18} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </> 
              : 
              <></>}


                {/* Quantity + Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={itemToEdit.amount}
                      className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                      onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        amount: Number(e.target.value)
                      })
                    }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={itemToEdit.maxAmount}
                      className="w-full h-12 px-4 rounded-2xl bg-zinc-100 focus:bg-white border border-transparent focus:border-blue-400 outline-none transition"
                      onChange={(e) =>
                      setItemToEdit({
                        ...itemToEdit,
                        maxAmount: Number(e.target.value)
                      })
                    }
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm font-medium text-zinc-700 mb-3">
                    Stock Status
                  </p>

                  <div className="grid grid-cols-3 gap-4">

                    <button
                      type="button"
                      onClick={() => {
                        setProAvb("Aviable")
                        setItemToEdit({
                            ...itemToEdit,
                            avb: 'Aviable'
                          })
                      }}
                      className={`h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${itemToEdit.avb == 'Aviable' ? 'bg-green-200 border-green-300 hover:bg-green-100' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'}`}
                    >
                      <Image src={highItem} alt="" width={28} />
                      <span className="text-sm font-medium">
                        Available
                      </span>
                    </button>
                      
                    <button
                      type="button"
                      onClick={() => {
                        setProAvb("Low stock")
                        setItemToEdit({
                            ...itemToEdit,
                            avb: 'Low stock'
                          })
                      }}
                      className={`h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${itemToEdit.avb == 'Low stock' ? 'bg-yellow-200 border-yellow-300 hover:bg-yellow-100' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'} `}
                    >
                      <Image src={lowItem} alt="" width={28} />
                      <span className="text-sm font-medium">
                        Low Stock
                      </span>
                    </button>
                      
                    <button
                      type="button"
                      onClick={() => {
                        setProAvb("No stock")
                        setItemToEdit({
                            ...itemToEdit,
                            avb: 'No stock'
                          })
                      }}
                      className={`h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${itemToEdit.avb == 'No stock' ? 'bg-red-200 border-red-300 hover:bg-red-100' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100'}`}
                    >
                      <Image src={noStockItem} alt="" width={28} />
                      <span className="text-sm font-medium">
                        No Stock
                      </span>
                    </button>
                      
                  </div>
                </div>
                      
                {/* Footer */}
                <div className="flex justify-between gap-5 pt-4 border-t border-zinc-200 flex-col sm:flex-row sm:gap-3">
                  <div>
                    <button className="px-5 h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition" onClick={()=> setMoreEditInfo((el) => !el)}>{moreEditInfo ? 'Less edit info' : 'More edit info'}</button>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 h-11 rounded-xl bg-zinc-100 hover:bg-zinc-200 transition"
                    onClick={()=> {
                      setItemToEdit(null) 
                      setShowEditPanel([false, null])
                      setMoreEditInfo(false)
                    }}
                    >
                    Cancel
                  </button>
                      
                  <button className="px-5 h-11 rounded-xl bg-black text-white hover:bg-zinc-800 transition" onClick={()=> editItemList(itemToEdit.id)}>
                    Save Changes
                  </button>
                  </div>
                </div>
                      
              </div>
            </div>
          </div>
          : 
          <div>
          
          </div>}
      </div>
        
        {/* creating screen */}
      <div className={`fixed inset-0 bg-black/50 ${openDiv ? 'flex' : 'hidden'} items-center justify-center z-5 sm:p-4 overflow-scroll sm:overflow-hidden`}>
        <div className="w-full max-w-200 bg-white backdrop-blur-2xl shadow-2xl p-8 sm:rounded-2xl absolute top-0 sm:relative sm:top-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Create Item</h1>
          <div className="space-y-5">

            {/* ── Product Name ── */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Product Name</span>
              <input
                type="text"
                name="name"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${proNameError ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="e.g. Olive oil 500ml"
                value={proName}
                onChange={(e) => { setProName(e.target.value); if (proNameError) setProNameError(validateProductName(e.target.value)) }}
                onBlur={() => setProNameError(validateProductName(proName))}
              />
              {proNameError && <p className="text-red-500 text-sm flex items-center gap-1"><span>⚠</span> {proNameError}</p>}
            </div>

            {/* ── Product Type ── */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Product Type</span>
              <input
                type="text"
                name="type-item"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${proTypeError ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="e.g Food"
                value={proType}
                onChange={(e) => { setProType(e.target.value); if (proTypeError) setProTypeError(validateProductType(e.target.value)) }}
                onBlur={() => setProTypeError(validateProductType(proType))}
              />
              {proTypeError && <p className="text-red-500 text-sm flex items-center gap-1"><span>⚠</span> {proTypeError}</p>}
            </div>

            {separateTypes('type').length > 0 && (
              <div>
                <p>Available types</p>
                <div className="flex gap-4 mt-2 flex-wrap">
                  {separateTypes('type').map((el, _) => (
                    <div
                      key={`${el}-${_}`}
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer ${proType === el ? 'bg-gray-500 text-gray-100' : 'bg-gray-200 text-gray-700'} rounded-full transition duration-200 hover:bg-gray-300`}
                      onClick={() => setProType(el)}
                    >
                      {el}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Product Brand ── */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Product Brand</span>
              <input
                type="text"
                name="brand"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300 text-gray-700`}
                placeholder="Enter brand name"
                value={proBrand}
                onChange={(e) => { setProBrand(e.target.value) }}
              />
            </div>

            {/* ── Purchase Location ── */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Purchase Location</span>
              <input
                type="text"
                name="store"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Purchase Location (Optional)"
                value={proStore}
                onChange={(e) => setProStore(e.target.value)}
              />
            </div>

            {/* ── Quantity & Capacity ── */}
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm font-semibold text-gray-700">Product Quantity</span>
                <input
                  type="number"
                  name="amount"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${proAmountError ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="0"
                  onChange={(e) => { setProAmount(Number(e.target.value)); if (proAmountError) setProAmountError(validateProductAmount(Number(e.target.value))) }}
                  onBlur={() => setProAmountError(validateProductAmount(proAmount))}
                />
                {proAmountError && <p className="text-red-500 text-sm flex items-center gap-1"><span>⚠</span> {proAmountError}</p>}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <span className="text-sm font-semibold text-gray-700">Product Capacity</span>
                <input
                  type="number"
                  name="maxAmount"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${proMaxAmountError ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="100"
                  onChange={(e) => { setProMaxAmount(Number(e.target.value)); if (proMaxAmountError) setProMaxAmountError(validateProductMaxAmount(Number(e.target.value), proAmount)) }}
                  onBlur={() => setProMaxAmountError(validateProductMaxAmount(proMaxAmount, proAmount))}
                />
                {proMaxAmountError && <p className="text-red-500 text-sm flex items-center gap-1"><span>⚠</span> {proMaxAmountError}</p>}
              </div>
            </div>

            {/* ── Initial Value ── */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700">Initial Value</p>
              <div className="w-full flex gap-4">
                <div
                  className={`flex-1 h-20 flex flex-col items-center justify-center border ${proAvb === 'Aviable' ? 'bg-green-400/40 border-green-400' : 'border-gray-300'} rounded-xl hover:bg-green-400/60 transition duration-200 cursor-pointer`}
                  onClick={() => { setProAvb('Aviable'); setProAvbError(null) }}
                >
                  <Image src={highItem} alt="aviable" />
                  <p>Available</p>
                </div>
                <div
                  className={`flex-1 h-20 flex flex-col items-center justify-center border ${proAvb === 'Low stock' ? 'bg-yellow-400/40 border-yellow-400' : 'border-gray-300'} rounded-xl hover:bg-yellow-400/60 transition duration-200 cursor-pointer`}
                  onClick={() => { setProAvb('Low stock'); setProAvbError(null) }}
                >
                  <Image src={lowItem} alt="lowStock" />
                  <p>Low Stock</p>
                </div>
                <div
                  className={`flex-1 h-20 flex flex-col items-center justify-center border ${proAvb === 'No stock' ? 'bg-red-400/40 border-red-400' : 'border-gray-300'} rounded-xl hover:bg-red-400/60 transition duration-200 cursor-pointer`}
                  onClick={() => { setProAvb('No stock'); setProAvbError(null) }}
                >
                  <Image src={noStockItem} alt="noStock" />
                  <p>No stock</p>
                </div>
              </div>
              {proAvbError && <p className="text-red-500 text-sm flex items-center gap-1"><span>⚠</span> {proAvbError}</p>}
            </div>

          </div>

          <div className="flex gap-3 mt-8">
            <button
              className="flex-1 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition duration-200"
              onClick={() => {
                setOpenDiv(false)
                setProNameError(null); setProAmountError(null)
                setProTypeError(null); setProMaxAmountError(null); 
                setProAvbError(null)
              }}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition duration-200"
              onClick={createProductList}
            >
              Create Item
            </button>
          </div>
        </div>
      </div>


      {/* Upload Image / imagen container */}
      {showImagePanel ? 
        <>
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/20 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <p className="text-lg font-semibold text-gray-900">Upload product picture</p>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                onClick={() => { setShowImagePanel(false); setPendingFile(null) }}>
                <Image src={closeIcon} alt="closeContainer" />
              </button>
            </div>

            <div className="p-6">
              <div
                className={`rounded-2xl border-2 border-dashed px-6 py-12 transition ${pendingFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  const allowed = ['image/png', 'image/jpeg', 'image/webp']
                  if (file && allowed.includes(file.type)) {
                    setPendingFile(file)
                  } else {
                    alert('Solo PNG, JPG o WEBP')
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Image src={imageCreateIcon} alt="CreateIcon" />
                  </div>
              
                  {pendingFile ? (
                    <p className="text-lg font-semibold text-blue-600">{pendingFile.name}</p>
                  ) : (
                    <>
                      <p className="text-lg font-semibold text-gray-900">Drag your image here</p>
                      <p className="mt-2 text-sm text-gray-500">PNG, JPG, o WEBP</p>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setPendingFile(file)
                    }}
                  />
                  <button
                    className="mt-5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Search file
                  </button>
                </div>
              </div>
            </div>
                  
            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
                onClick={() => { setShowImagePanel(false); setPendingFile(null) }}>
                Cancel
              </button>
              <button
                className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
                disabled={!pendingFile}
                onClick={() => pendingFile && uploadImage(pendingFile)}
              >
                Save image
              </button>
            </div>
            {uploadingImage && (
              <div className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-50 border-t border-blue-100">
                <svg className="animate-spin w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <p className="text-sm font-medium text-blue-600">Uploading image...</p>
              </div>
            )}
          </div>
        </div>
        </> 
        : 
        <></>}
        {openImageContainer && imageOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/70 p-4"
            onClick={() => { setOpenImageContainer(false); setImageOpen(undefined) }}>
            <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition z-10 cursor-pointer"
                onClick={() => { setOpenImageContainer(false); setImageOpen(undefined) }}>
                <Image src={closeIcon} alt="close" />
              </button>
              <img
                src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${imageOpen}`}
                alt="product"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        )}
    </> 
    : 
    <>
      <div className="w-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-linear-to-br from-gray-100 to-white shadow-inner">
            <svg className="animate-spin w-10 h-10 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">Loading list</h2>
            <p className="text-sm text-gray-500 mt-1">Fetching your items — this will only take a moment.</p>
          </div>
        </div>
      </div>
    </>
    }
    </>
  );
}