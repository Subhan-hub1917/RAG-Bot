"use client"
import { useEffect, useRef, useState } from "react";
import { Bars } from "react-loader-spinner";
import Markdown from "react-markdown";

export default function Home() {
  const [query,setQuery]=useState({
    role:'user',
    content:''
  })
  const messagesRef=useRef(null);
  const [input,setInput]=useState('')
  const [loading,setLoading]=useState(false)   
  const [messages,setMessages]=useState([
    { role:'system',
      content:'Hi! How can i assist you?'
    },
  ])

  const scrollToBottom=()=>{
    messagesRef.current?.scrollIntoView({behavior:'smooth'})
  }
  useEffect(()=>{
    scrollToBottom();
  },[messages])
  
  
const handleQuery = async (e) => {
  e.preventDefault();
  if (input === '') {
    return;
  }
  setLoading(true);
  setQuery((prev) => ({ ...prev, content: input }));
  setMessages((prev) => [...prev, { role: 'user', content: input }]);

  try {
    const res = await fetch("https://rate-my-professor-backend-git-main-subhan-hub1917s-projects.vercel.app/api/query-professors", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userResponse: input }),
    });

    if (!res.ok) {
      setLoading(false);
      const errorText = await res.text();
      throw new Error(`Network response was not ok: ${errorText}`);
    }
    const result = await res.json();
    console.log("API Response:", result);

    if (result && result.data) {
      const systemResponse = {
        role: 'system',
        content: result.data,
      };

      setMessages((prev) => [...prev, systemResponse]);
    } else {
      console.error('Unexpected response structure:', result);
      throw new Error('Unexpected response structure from API');
    }

    setLoading(false);
    setInput('')
  } catch (error) {
    alert(`Error Requesting to Model: ${error.message}`);
    console.error('Fetch error:', error); // Log the error to debug
    setLoading(false);
    setInput('')

  }
};

return (
    <main className="relative top-0 h-screen py-0 overflow-hidden z-50 bg-black text-white" >
      <section className='backdrop-blur-lg h-screen flex flex-col items-center justify-center'>
          <div className='text-2xl py-3 md:text-5xl px-5 font-semibold my-1 '>RAG-Bot</div>
          <div className=" md:border overflow-hidden bg-slate-950 border border-slate-600 my-0 md:my-3 rounded-xl h-full w-screen  md:w-1/2  flex flex-col items-center justify-between">
              {/* message sections */}
              <div className="overflow-y-auto overflow-x-hidden rounded-xl py-2 px-2 w-full max-h-full">
              {messages.map((m, index) => (
                            <div
                                key={index}
                                className={`my-1 flex items-start text-center ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {m.role === "user" ? (
                                    <>
                                        <Markdown
                                            className={`text-sm p-2 inline-block bg-slate-700 text-end rounded-s-2xl rounded-b-2xl`}
                                        >
                                            {m.content}
                                        </Markdown>
                                        <i className="bi bi-person  w-8 h-8 mr-1 text-3xl"></i>
                                        
                                    </>
                                ) : m.role === "system" && (
                                    <>
                                      
                                        <i className="bi bi-robot w-8 h-8 mr-1 text-3xl"></i>
                                        <Markdown
                                            className={`text-sm p-2 inline-block  bg-slate-700 text-left mt-2 mb-2 rounded-e-2xl rounded-b-2xl`}
                                        >
                                            {m.content}
                                        </Markdown>
                                    </>
                                )}
                            </div>
                        ))}
                <div ref={messagesRef} />
              </div>
              {/* prompt section */}
              <div className="w-full py-3 px-3 rounded-t-lg bg-black border border-slate-700 rounded-xl">
                <form onSubmit={handleQuery} className="w-full flex items-center justify-between space-x-3">
                  <input
                    placeholder="Write your query here..."
                    className="text-black h-10 w-full rounded-lg px-3"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {
                    loading
                    ?
                    <button onClick={()=>setLoading(false)}>
                      <Bars
                        height="40"
                        width="40"
                        color="#ffffff"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        />
                      </button>
                    :
                      <button type="submit" className="bi bi-send-fill rounded-lg  py-2 px-4  text-lg"></button>

                  }
    
                </form>
              </div>
          </div>
      </section>
    </main>
)
}
