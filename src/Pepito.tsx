import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";

export type Horario = {
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
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [asignaturas, setAsignaturas] = useState<Map<String, String>>(new Map());
    const [_, setSecciones] = useState<Number[]>([]);
    
    const handleChangeAsignatura = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const code = event.target.value;
        const sections = horarios.filter((horario: Horario) => {
            return horario.node.code === code;
        });


        const uniqueSections : Set<Number> = new Set();
        sections.forEach((section: Horario) => {
            uniqueSections.add(Number(section.node.section));
        });

        const uniqueSectionsPrimitives = Array.from(uniqueSections).map((section) => Number(section));
        uniqueSectionsPrimitives.sort((a, b) => a - b);

        setSecciones(uniqueSectionsPrimitives);
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api-salas.docencia.io/');
            const data = await response.json();
    
            setHorarios(data.data.allSalasUdps.edges.filter((horario: Horario) => {
                return horario.node.code !== '' && horario.node.code !== null && horario.node.code !== undefined;
            }));

            let asignaturasMap : Map<String, String> = new Map();
            for(const horario of horarios){
                asignaturasMap.set(horario.node.code.replace("-CAT", "").replace("-AYU", "").replace("-LAB", ""), horario.node.course);
            }

            asignaturasMap = new Map([...asignaturasMap.entries()].sort((a, b) => String(a[1]).localeCompare(String(b[1]))));
            setAsignaturas(asignaturasMap);
        }

        fetchData();
    }, []);

    return (
        <div className="w-screen h-screen dark text-foreground bg-background flex flex-col items-center justify-center">
        <Select label="Selecciona un curso!" className="max-w-xs" onChange={handleChangeAsignatura}>        
            {[...asignaturas.keys()].map((codigo) => {
                return (
                <SelectItem key={codigo.toString()}>
                    {asignaturas.get(codigo)}
                </SelectItem>
                )
            })}
        </Select>
        {/*(secciones.length !== 0) ? <Select label="Selecciona una sección!" className="max-w-xs mt-5 mb-40">        
        {secciones.map((seccion, index) => (
          <SelectItem key={index}>
            {seccion.toString()}
          </SelectItem>
        ))}
        </Select> : <></>*/}

            
        </div>
    )

    
}

export default App;