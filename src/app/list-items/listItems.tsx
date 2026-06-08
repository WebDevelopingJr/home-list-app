import Image, { StaticImageData } from "next/image"
import { useEffect, useState } from "react"

type StateAviable = 'Aviable' | 'Low stock' | 'No stock'
type CheckElements = 'styles' | 'images'

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

type ItemListProps = {
  showArrList: ListDb[],
  arrInfo: any,
  setImageOpen: (id: string) => void,
  setOpenImageContainer: (val: boolean) => void,
  setShowImagePanel: (val: boolean) => void,
  setElementListImage: (el: ListDb) => void,
  setItemToEdit: (el: ListDb) => void,
  setShowEditPanel: (val: [boolean, ListDb]) => void,
  deleteListElement: (id: ReturnType<typeof crypto.randomUUID>) => void,
  giveStockDeclarations: (state: StateAviable, type: CheckElements) => any,
  giveBarStyles: (state: StateAviable) => string,
  defaultImage: StaticImageData,
  openImageIcon: StaticImageData,
  addImgIcon: StaticImageData,
  editIconList: StaticImageData,
  deleteList: StaticImageData,
}


export function useIsMobile(breakpoint = 1060) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}


export function ItemListDevice({ showArrList, arrInfo, setImageOpen, setOpenImageContainer, setShowImagePanel, setElementListImage, setItemToEdit, setShowEditPanel, deleteListElement, giveStockDeclarations, giveBarStyles, defaultImage, openImageIcon, addImgIcon, editIconList, deleteList }: ItemListProps) {
  return (
    <>
      {showArrList.map((el, inx) => (
        <div className="w-full flex items-center px-6 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors group" key={`${el.name} ${inx}`}>

          {/* Image */}
          <div className="w-16 mr-5 shrink-0">
            {el.image !== undefined ? (
              <img src={`https://ylduecmgivurnnlcskus.supabase.co/storage/v1/object/public/listItems/${arrInfo.id}/${el.image}`}
                alt="product" className="w-14 h-14 rounded-xl object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }} />
            ) : (
              <div className="w-14 h-14 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                <Image src={defaultImage} alt="defaultImage" className="w-8 h-8 opacity-40" />
              </div>
            )}
          </div>

          {/* Name + tags */}
          <div className="flex-1 flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-900">{el.name}</p>
            <div className="flex gap-1.5 flex-wrap">
              {el.brand !== '' && <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.brand}</span>}
              <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.type}</span>
              {el.store !== '' && <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.store}</span>}
            </div>
          </div>

          {/* Qty */}
          <div className="w-32 flex flex-col items-center gap-0.5">
            <p className="text-sm font-bold text-gray-900">{el.amount}</p>
            <p className="text-xs text-gray-400">of {el.maxAmount}</p>
          </div>

          {/* Progress */}
          <div className="w-48 flex items-center gap-2 px-4">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${giveBarStyles(el.avb)}`} style={{ width: `${Math.floor((el.amount / el.maxAmount) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 w-8 text-right">{Math.floor((el.amount / el.maxAmount) * 100)}%</p>
          </div>

          {/* Status badge */}
          <div className="w-28 flex justify-center">
            <span className={`h-7 px-3 text-xs font-medium flex items-center gap-1.5 rounded-lg ${giveStockDeclarations(el.avb, 'styles')}`}>
              <Image src={giveStockDeclarations(el.avb, 'images')} alt="stock" width={12} /> {el.avb}
            </span>
          </div>

          {/* Actions */}
          <div className="w-24 flex items-center justify-end gap-1.5">
            {el.image !== undefined ? (
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }}>
                <Image src={openImageIcon} alt="openImage" width={15} />
              </button>
            ) : (
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => { setShowImagePanel(true); setElementListImage(el) }}>
                <Image src={addImgIcon} alt="addImage" width={15} />
              </button>
            )}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => { setItemToEdit(el); setShowEditPanel([true, el]) }}>
              <Image src={editIconList} alt="edit" width={15} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
              onClick={() => deleteListElement(el.id)}>
              <Image src={deleteList} alt="delete" width={15} />
            </button>
          </div>

        </div>
      ))}
    </>
  )
}

export function ItemListPhone({ showArrList, arrInfo, setImageOpen, setOpenImageContainer, setShowImagePanel, setElementListImage, setItemToEdit, setShowEditPanel, deleteListElement, giveStockDeclarations, giveBarStyles, defaultImage, openImageIcon, addImgIcon, editIconList, deleteList }: ItemListProps) {
  return (
    <>
      {showArrList.map((el, inx) => (
        <div className="w-full flex flex-col px-5 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors" key={`${el.name} ${inx}`}>

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-sm font-semibold text-gray-900 leading-snug">{el.name}</h1>
            <span className={`shrink-0 h-6 px-2.5 text-xs font-medium flex items-center gap-1 rounded-lg ${giveStockDeclarations(el.avb, 'styles')}`}>
              <Image src={giveStockDeclarations(el.avb, 'images')} alt="stock" width={12} /> {el.avb}
            </span>
          </div>

          <div className="flex gap-1.5 mt-2 flex-wrap">
            {el.brand !== '' && <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.brand}</span>}
            <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.type}</span>
            {el.store !== '' && <span className="py-0.5 px-2.5 rounded-md text-xs bg-gray-100 text-gray-600 font-medium">{el.store}</span>}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <p className="text-xs font-semibold text-gray-900 shrink-0">{el.amount}<span className="text-gray-400 font-normal"> / {el.maxAmount}</span></p>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${giveBarStyles(el.avb)}`} style={{ width: `${Math.floor((el.amount / el.maxAmount) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 shrink-0">{Math.floor((el.amount / el.maxAmount) * 100)}%</p>
          </div>

          <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
            {el.image !== undefined ? (
              <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
                onClick={() => { setImageOpen(el.image!); setOpenImageContainer(true) }}>
                <Image src={openImageIcon} alt="openImage" width={16} />
              </button>
            ) : (
              <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
                onClick={() => { setShowImagePanel(true); setElementListImage(el) }}>
                <Image src={addImgIcon} alt="addImage" width={16} />
              </button>
            )}
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
              onClick={() => { setItemToEdit(el); setShowEditPanel([true, el]) }}>
              <Image src={editIconList} alt="edit" width={16} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 transition-colors"
              onClick={() => deleteListElement(el.id)}>
              <Image src={deleteList} alt="delete" width={16} />
            </button>
          </div>

        </div>
      ))}
    </>
  )
}