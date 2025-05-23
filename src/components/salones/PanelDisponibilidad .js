import React, { useState, useEffect } from "react"
import {
  CContainer,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CSpinner,
} from "@coreui/react"

const cursosEjemplo = ["Matemáticas", "Física", "Química", "Biología", "Historia"]
const profesoresEjemplo = ["Ana Pérez", "Juan López", "Laura Gómez", "Carlos Ruiz"]
const rolesEjemplo = ["Docente", "Supervisor", "Auxiliar"]

const disponibilidadVacia = {
  salones: [
    {
      id: 0,
      nombre: "Sin datos",
      horarios: [
        {
          bloque: "Bloque 1",
          curso: "",
          profesor: "",
          rol: "",
        },
      ],
    },
  ],
}

const PanelDisponibilidad = () => {
  const [modoEdicion, setModoEdicion] = useState(false)
  const [disponibilidad, setDisponibilidad] = useState(disponibilidadVacia)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    async function fetchDisponibilidad() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/disponibilidad")
        if (!res.ok) throw new Error("Error al cargar datos")
        const data = await res.json()
        // Si la data está vacía o sin salones, cargamos vacíos
        if (!data || !data.salones || data.salones.length === 0) {
          setDisponibilidad(disponibilidadVacia)
        } else {
          setDisponibilidad(data)
        }
      } catch (e) {
        setDisponibilidad(disponibilidadVacia)
      } finally {
        setLoading(false)
      }
    }
    fetchDisponibilidad()
  }, [])

  // Manejo de cambios en modo edición
  const handleChange = (salonId, bloqueIdx, campo, valor) => {
    setDisponibilidad((prev) => {
      const salonesNuevos = prev.salones.map((salon) => {
        if (salon.id === salonId) {
          const horariosNuevos = salon.horarios.map((horario, idx) => {
            if (idx === bloqueIdx) {
              return {
                ...horario,
                [campo]: valor,
              }
            }
            return horario
          })
          return { ...salon, horarios: horariosNuevos }
        }
        return salon
      })
      return { salones: salonesNuevos }
    })
  }

  const handleGuardar = async () => {
    setGuardando(true)
    setError(null)
    try {
      const res = await fetch("/api/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disponibilidad),
      })
      if (!res.ok) throw new Error("Error al guardar datos")
      alert("Datos guardados correctamente")
      setModoEdicion(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelar = () => {
    setModoEdicion(false)
    setError(null)
    setLoading(true)
    // Recargar datos para descartar cambios
    fetch("/api/disponibilidad")
      .then((res) => {
        if (!res.ok) throw new Error("Error al recargar datos")
        return res.json()
      })
      .then((data) => {
        if (!data || !data.salones || data.salones.length === 0) {
          setDisponibilidad(disponibilidadVacia)
          setError("No se encontraron datos, mostrando vacío")
        } else {
          setDisponibilidad(data)
        }
      })
      .catch((e) => {
        setDisponibilidad(disponibilidadVacia)
        setError("No se pudo recargar, mostrando vacío")
      })
      .finally(() => setLoading(false))
  }

  if (loading)
    return (
      <CContainer className="py-4 d-flex justify-content-center">
        <CSpinner />
      </CContainer>
    )

  return (
    <CContainer className="py-4">
      {error && (
        <p className="text-warning" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      )}
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h3>Disponibilidad de Espacios y Asignaciones</h3>
          {!modoEdicion ? (
            <CButton color="primary" onClick={() => setModoEdicion(true)}>
              Editar
            </CButton>
          ) : (
            <>
              <CButton color="success" onClick={handleGuardar} disabled={guardando} className="me-2">
                {guardando ? "Guardando..." : "Guardar"}
              </CButton>
              <CButton color="secondary" onClick={handleCancelar} disabled={guardando}>
                Cancelar
              </CButton>
            </>
          )}
        </CCardHeader>
        <CCardBody>
          {disponibilidad.salones.map((salon) => (
            <div key={salon.id} className="mb-4">
              <h5>{salon.nombre}</h5>
              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Bloque</CTableHeaderCell>
                    <CTableHeaderCell>Curso</CTableHeaderCell>
                    <CTableHeaderCell>Profesor</CTableHeaderCell>
                    <CTableHeaderCell>Rol de Supervisión</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {salon.horarios.map((horario, idx) => (
                    <CTableRow key={idx}>
                      <CTableDataCell>{horario.bloque}</CTableDataCell>
                      <CTableDataCell>
                        {!modoEdicion ? (
                          horario.curso || <em>Libre</em>
                        ) : (
                          <CFormSelect
                            value={horario.curso || ""}
                            onChange={(e) =>
                              handleChange(salon.id, idx, "curso", e.target.value)
                            }
                          >
                            <option value="">Libre</option>
                            {cursosEjemplo.map((curso) => (
                              <option key={curso} value={curso}>
                                {curso}
                              </option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {!modoEdicion ? (
                          horario.profesor || <em>Sin asignar</em>
                        ) : (
                          <CFormSelect
                            value={horario.profesor || ""}
                            onChange={(e) =>
                              handleChange(salon.id, idx, "profesor", e.target.value)
                            }
                          >
                            <option value="">Sin asignar</option>
                            {profesoresEjemplo.map((prof) => (
                              <option key={prof} value={prof}>
                                {prof}
                              </option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {!modoEdicion ? (
                          horario.rol || <em>Sin asignar</em>
                        ) : (
                          <CFormSelect
                            value={horario.rol || ""}
                            onChange={(e) =>
                              handleChange(salon.id, idx, "rol", e.target.value)
                            }
                          >
                            <option value="">Sin asignar</option>
                            {rolesEjemplo.map((rol) => (
                              <option key={rol} value={rol}>
                                {rol}
                              </option>
                            ))}
                          </CFormSelect>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ))}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default PanelDisponibilidad
