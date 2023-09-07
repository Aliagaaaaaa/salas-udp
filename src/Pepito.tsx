import { useEffect, useState } from "react";
import { Card, Select, SelectItem } from "@tremor/react";
import data from "./cleaned.json";

export type Horario = {
    code: string;
    section: string;
    course: string;
    place: string;
    start: string;
    finish: string;
    day: number;
    teacher: string;
}

const numberToDay = (day: number) => {
    if (day === 1) return "Lunes";
    if (day === 2) return "Martes";
    if (day === 3) return "Miércoles";
    if (day === 4) return "Jueves";
    if (day === 5) return "Viernes";
    if (day === 6) return "Sábado";
    if (day === 7) return "Domingo";
}

function App() {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [asignaturas, setAsignaturas] = useState<Map<String, String>>(new Map());
    const [asignatura, setAsignatura] = useState<String>('');
    const [secciones, setSecciones] = useState<Number[]>([]);
    const [horas, setHoras] = useState<String[]>([]);


    useEffect(() => {
        const filteredHorarios = data.allSalasUdps.filter((horario: Horario) => {
            return horario.code !== '' && horario.code !== null && horario.code !== undefined;
        });

        let asignaturasMap: Map<string, string> = new Map();
        for (const horario of filteredHorarios) {
            asignaturasMap.set(horario.code.replace("-CAT", "").replace("-AYU", "").replace("-LAB", ""), horario.course);
        }

        asignaturasMap = new Map([...asignaturasMap.entries()].sort((a, b) => String(a[1]).localeCompare(String(b[1]))));

        setHorarios(filteredHorarios);
        setAsignaturas(asignaturasMap);

    }, [data.allSalasUdps]);

    const handleAsignatureChange = (value: string) => {
        const test = horarios.filter((horario: Horario) => {
            return horario.code.includes(value);
        }).map((horario: Horario) => {
            return Number(horario.section);
        });

        const uniqueSections = [...new Set(test)];
        uniqueSections.sort((a, b) => a - b);
        setSecciones(uniqueSections);
        setAsignatura(value);
        setHoras([]);
    }

    const handleSectionChange = (value: string) => {


        const test = horarios.filter((horario: Horario) => {
            return horario.code.includes(asignatura.toString()) && Number(horario.section) === Number(value);
        }).map((horario: Horario) => {
            return numberToDay(horario.day) + " " + horario.start + " - " + horario.finish + " " + horario.place;
        }).sort((a, b) => {
            const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

            const indexA = daysOrder.indexOf(a.split(" ")[0]);
            const indexB = daysOrder.indexOf(b.split(" ")[0]);

            return indexA - indexB;
        });

        setHoras(test);
    }


    /* lets make a better design for this!*/
    return (
        <div className="w-screen h-screen dark text-foreground bg-background flex flex-col items-center justify-center">
            <Select placeholder="Selecciona un curso..." className="max-w-xs" onValueChange={handleAsignatureChange}>
                {[...asignaturas.keys()].map((codigo) => {
                    return (
                        <SelectItem key={codigo.toString()} value={codigo.toString()}>
                            {asignaturas.get(codigo) + " - " + codigo}
                        </SelectItem>
                    )
                })}
            </Select>
            {secciones.length > 0 &&
                <Select placeholder="Selecciona una sección..." className="max-w-xs mt-2" onValueChange={handleSectionChange}>
                    {secciones.map((seccion) => {
                        return (
                            <SelectItem key={seccion.toString()} value={seccion.toString()}>
                                {seccion.toString()}
                            </SelectItem>
                        )
                    })}
                </Select>
            }
            {
                horas.length > 0 && (
                    <Card className="max-w-xs mx-auto mt-2 bg-white rounded-lg shadow-md p-4">
                        <ul className="list-disc pl-4">
                            {horas.map((hora) => {
                                return (
                                    <li key={hora.toString()} className="text-gray-700">{hora}</li>
                                )
                            })}
                        </ul>
                    </Card>
                )
            }
        </div>
    )
}

export default App;