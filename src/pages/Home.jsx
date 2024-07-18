import React from 'react'
import Axios from "axios"

import Sorted from '../components/Sorted'
import Categories from '../components/Categories'
import PizzaBlock from '../components/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import EditDialog from '../components/EditDialog'
import Edit from '../components/Edit'

import editlogo from "../assets/img/edit-icon.png"
import cancelLogo from "../assets/img/cancelEdit.png"
import plus from "../assets/img/plus.png"

export default function Home({addToCartTovar, setAddToCartTovar, buyCount, setBuyCount, setBuySumma, buySumma}){
    const [enterCategories, setEnterCategories] = React.useState(0)
    const [enterSorted, setEnterSorted] = React.useState('rating')
    const [pizzas, setPizzas] = React.useState([])
    const [defaultItems, setDefaultItems] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [editDialog, setEditDialog] = React.useState(false)
    const [edit, setEdit] = React.useState(false)
    const [editObject, setEditObject] = React.useState({})
    const [clickAdd, setClickAdd] = React.useState(false)
    React.useEffect(()=>{
        setIsLoading(true)
        Axios.get(`https://65db02b53ea883a15290ffe7.mockapi.io/items` +
            ( enterCategories ? `?category=` + enterCategories + `&sortby=` + enterSorted : `?sortby=` + enterSorted )
            ).then((obj)=>{
            setPizzas(obj.data)
            setIsLoading(false)
        })
        Axios.get('https://65db02b53ea883a15290ffe7.mockapi.io/default-product').then((obj)=>{
            setDefaultItems(obj.data)
        })
    }, [enterCategories, enterSorted])
  return (
    <>
    {edit && <Edit setEdit={setEdit} editObject={editObject}/>}
    {clickAdd && <EditDialog setPizzas={setPizzas} setClickAdd={setClickAdd}/>}
    <div className="content__top">
        <Categories enterCategories={enterCategories} setEnterCategories={setEnterCategories}/>
        <Sorted setEnterSorted={setEnterSorted}/>
    </div>
    <div className='wrapperedit'>
        <h2 className="content__title">Все пиццы</h2>
        <div className='baseEdit'>
            {editDialog && <p onClick={()=>{
                let a = confirm('Вернуть стандартные данные в БД?')
                if(a == true){
                    pizzas.map((obj)=>{
                        Axios.delete(`https://65db02b53ea883a15290ffe7.mockapi.io/items/${obj.id}`)
                    })
                    defaultItems.map((obj)=>{
                        Axios.post("https://65db02b53ea883a15290ffe7.mockapi.io/items", obj)
                    })
                    setPizzas(defaultItems)
                    console.log('Вернули!')
                }
            }}>Вернуть данные</p>}
            {!isLoading && <img src={!editDialog ? editlogo : cancelLogo} className="editlogo" alt="edit-logo" onClick={()=>setEditDialog((prev)=>!prev)}/>}
        </div>
    </div>
    <div className="content__items">
    {
        isLoading ? [...new Array(8)].map((_, index)=><Skeleton key={index}/>) :
        (pizzas.map((obj, index)=>(
            <PizzaBlock {...obj} setEditObject={setEditObject} obj={obj} key={obj.id} clickAdd={clickAdd} edit={edit} setEdit={setEdit} setClickAdd={setClickAdd} pizzas={pizzas} setPizzas={setPizzas} editDialog={editDialog} addToCartTovar={addToCartTovar} setAddToCartTovar={setAddToCartTovar} buyCount={buyCount} setBuyCount={setBuyCount} setBuySumma={setBuySumma} buySumma={buySumma}/>
        )))
    }
    {editDialog && <div className="block-added" onClick={()=>{
        setClickAdd(true)
        window.scrollTo(0, 0)
    }}>
    <img src={plus} alt="added" />
    <p>Добавить товар</p> 
    </div>}
    </div>
    </>
  )
}