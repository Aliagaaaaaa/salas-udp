import { useEffect, useState } from 'react'

export type Sala = {
  node: {
    code: string;
    section: string;
    course: string;
    place: string;
    start: string;
    finish: string;
    day: number;
    teacher: string;
  }
}

function App() {
  const [salas, setSalas] = useState<Sala[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api-salas.docencia.io/');
      const data = await response.json();

      const salasFiltradas = data.data.allSalasUdps.edges.filter((sala: Sala) => {
        return sala.node.code !== '' && sala.node.code !== null && sala.node.code !== undefined;
      });

      setSalas(salasFiltradas.map((sala: Sala) => {
        return {
          node: {
            code: sala.node.code,
            section: sala.node.section,
            course: sala.node.course,
            place: sala.node.place,
            start: sala.node.start,
            finish: sala.node.finish,
            day: sala.node.day,
            teacher: sala.node.teacher
          }
        }
      }));
    }

    fetchData()

  }, [])
  
  return (
    <div className="App">
      <h1>Salas</h1>
      {salas.map((sala) => {
        const { code, section, course, place, start, finish, day, teacher } = sala.node;

        return (
          <div key={code}>
            <h2>{code}</h2>
            <p>{section}</p>
            <p>{course}</p>
            <p>{place}</p>
            <p>{start}</p>
            <p>{finish}</p>
            <p>{day}</p>
            <p>{teacher}</p>
          </div>
        );
      })}
    </div>
  )
}

export default App
