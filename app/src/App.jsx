import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const VITE_API_URL = import.meta.env.VITE_API_URL;




function App() {
  const[flashcard,setFlashcard]=useState([])
  const[question,setQuestion]=useState('')
  const[answer,setAnswer]=useState('')
  const[showUnkown,setShowUnkown]=useState(false)
  const[currentPage,setCurrentPage]=useState(1)
  const[editingCard,setEditingCard]=useState(null)
  const[cP,setCP]=useState(1)

  const cardsPerPage=3;

  useEffect(() =>{
   axios.get(VITE_API_URL).then((res) => setFlashcard(res.data))
  },[])

  const addFlashCard=async()=>{
    if(question && answer){
      const newCard= {question,answer};
      const res=await axios.post(VITE_API_URL,newCard);
      setFlashcard([...flashcard,res.data])
      setQuestion('')
      setAnswer('')
    }
  }

  const totalCards=flashcard.length;
  const knownCards=flashcard.filter((card) => card.known).length

  const editFlashCard=async(id,updatedQuestion,updatedAnswer)=>{
    const res=await axios.put(`${VITE_API_URL}/${id}`,{
    question:updatedQuestion,
    answer:updatedAnswer
  })
  setFlashcard(flashcard.map((card) => card._id === id ? res.data : card));
  setEditingCard(null)
}

const deletedCard=async(id) =>{
  await axios.delete(`${VITE_API_URL}/${id}`)
  setFlashcard(flashcard.filter((card) => card._id !== id))
}
const toggleKnown=async(id,known) =>{
  const res= await axios.put(`${VITE_API_URL}/${id}`, {known:!known})
  setFlashcard(flashcard.map((card) => (card._id === id ? res.data:card)))
}

const lastIndex=cP * cardsPerPage;
const firstIndex=lastIndex - cardsPerPage;
const paginatedCards = flashcard
.filter((card) => (showUnkown ? !card.known:true))
.slice(firstIndex,lastIndex)

const totalPages=Math.ceil(
  flashcard.filter((card) => (showUnkown ? !card.known:true)).length/cardsPerPage

)

  

  return (
    <>
      <div className='min-h-screen bg-gray-100 flex'>
        <div className='w-1/3 bg-white p-6 shadow'>
          <h2 className='text-xl font-bold mb-4 text-gray-800 '>Add Flashcard</h2>
          <input 
            value={question}
            onChange={(e)=>setQuestion(e.target.value)}
          type="text"  placeholder="Question" className='w-full mb-4 p-2 border border-gray-300 rounded'></input>
          <input 
             value={answer}
             onChange={(e)=>setAnswer(e.target.value)}
          type="text" placeholder="Answer" className='w-full mb-4 p-2 border border-gray-300 rounded'></input>
          
          <button  onClick={addFlashCard} className='w-full bg-red-500 text-white p-2 rounded hover:bg-red-600'>Add Flashcard</button>
        </div>
  
        <div className='w-2/3 p-6'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <p className='text-gray-700'>Total Cards:
                   <span className='font-bold'>{totalCards}</span>

              </p>
              <p className='text-gray-700'>Known:
                   <span className='font-bold'>{knownCards}</span>

              </p>
              <p className='text-gray-700'>Unknown:{" "}
                   <span className='font-bold'>{totalCards - knownCards}</span>

              </p>
            </div>

            <button 
            onClick={() => setShowUnkown(!showUnkown)}
            className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'>
              
              {showUnkown ? "Show All Card" : "Review Unknown Cards"}
            </button>
          </div>

   
          <div>
          {paginatedCards.map((card) => (
            <div 
              key={card._id}
            className='p-4 border mb-2 rounded'>
              {editingCard === card._id ? (
                <>
              <input 
                 type="text"
                 defaultValue={card.question}
                 onChange={(e) => setFlashcard(flashcard.map((c) => c._id === card._id ? {...c,question:e.target.value} : c))}
              className='w-full mb-2 p-2 border border-gray-300 rounded'></input>
              <input 
                defaultValue={card.answer}
                onChange={(e) => setFlashcard(flashcard.map((c) => c._id === card._id ? {...c,answer:e.target.value} : c))}
          
              className='w-full mb-2 p-2 border border-gray-300 rounded'></input>
              <button 
                onClick={() =>editFlashCard(card._id,card.question,card.answer)}
              className='bg-red-500 text-white mr-2 px-4 py-2 rounded hover:bg-gray-400'>Save</button>
              <button 
               onClick={() => setEditingCard(null)}
              className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'>Cancel</button>
             </>
            ) : (
              <>
             <h2 className='font-semibold text-lg'>{card.question}</h2>
             <p className='text-gray-600'>{card.answer}</p>
            
             <div className='mt-2 flex justify-between items-center'>
              <button 
                onClick={() => toggleKnown(card._id,card.known)}
              className ={`text-sm px-3 py-1 rounded bg-red-500 text-white ${
                card.known ? "bg-gray-400 text-white" : "bg-red-500 text-white"
              }`}>
                {card.known ? "Mark as Unknown" : " Known"}
              </button>
              <button  onClick={() => setEditingCard(card._id)}className ='text-sm px-3 py-1 rounded bg-blue-500 text-white'>Edit</button>
              <button onClick={() => deletedCard(card._id)}className ='text-sm px-3 py-1 rounded bg-gray-400 text-white'>Delete</button>
             </div>
             </>
             )}
            </div>
             ))}
          </div>
          <div className='flex justify-center items-center mt-4'>
          <button 
            onClick={() => setCP((prev) => Math.max(prev - 1,1))}
            disabled={cP === 1}
          className='px-3 py-1 bg-gray-300 text-gray-700 rounded'>Previous</button>
          <span className='mx-4 text-gray-700'>Page</span>
          <button 
            onClick={() => setCP((prev) => Math.min(prev + 1,totalPages))}
            disabled={cP === totalPages}
          className='px-3 py-1 bg-gray-300 text-gray-700 rounded'>Next</button>
          
        </div>
        </div>
        
      </div>
    </>
  )
}

export default App
