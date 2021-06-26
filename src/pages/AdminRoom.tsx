
import {useHistory, useParams} from 'react-router-dom'
import { Button } from './../components/Button';
import { RoomCode } from './../components/RoomCode';
// import { useAuth } from './../hooks/useAuth';
import { Question } from './../components/Question/index';
import '../styles/room.scss'
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import deleteImg from '../assets/images/delete.svg'
import LogoImg from '../assets/images/logo.svg'
import answerImg from '../assets/images/answer.svg'
import checkImg from '../assets/images/check.svg'



type RoomParams={
  id: string
}
export function AdminRoom(){
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();

  const roomId = params.id;

  const {title, questions} = useRoom(roomId)

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que você deseja excluir esa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
      isAnswer: true,
    })
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
      isHighLighted: true,
    })
  }

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={LogoImg} alt="letmeask" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined  onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question =>{
            return(
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswer={question.isAnswer}
                isHighLighted={question.isHighLighted} >

                  {!question.isAnswer &&(
                    <>
                    <button
                      type="button"
                      onClick={()=> handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>

                      <button
                      type="button"
                      onClick={()=> handleHighlightQuestion(question.id)}
                      >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                      </button>
                    </>
                  ) }

                  <button
                    type="button"
                    onClick={()=> handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Deletar pergunta" />
                  </button>
                </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}