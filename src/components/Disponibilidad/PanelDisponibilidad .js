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
  const [soloConAsignaciones, setSoloConAsignaciones] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    async function fetchDisponibilidad() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/disponibilidad`)
        if (!res.ok) throw new Error("Error al cargar datos")
        const data = await res.json()
        if (!data || !data.salones || data.salones.length === 0) {
          setDisponibilidad(disponibilidadVacia)
        } else {
          setDisponibilidad(data)
        }
      } catch (e) {
        setDisponibilidad(disponibilidadVacia)
        setError("Error cargando datos, mostrando vacío")
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/disponibilidad`, {
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
    fetch(`${import.meta.env.VITE_API_URL}/api/disponibilidad`)
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
      .catch(() => {
        setDisponibilidad(disponibilidadVacia)
        setError("No se pudo recargar, mostrando vacío")
      })
      .finally(() => setLoading(false))
  }

  const agregarBloque = (salonId) => {
    setDisponibilidad((prev) => {
      const salonesNuevos = prev.salones.map((salon) => {
        if (salon.id === salonId) {
          return {
            ...salon,
            horarios: [
              ...salon.horarios,
              {
                bloque: `Bloque ${salon.horarios.length + 1}`,
                curso: "",
                profesor: "",
                rol: "",
              },
            ],
          }
        }
        return salon
      })
      return { salones: salonesNuevos }
    })
  }

  const borrarBloque = (salonId, bloqueIdx) => {
    setDisponibilidad((prev) => {
      const salonesNuevos = prev.salones.map((salon) => {
        if (salon.id === salonId) {
          const nuevosHorarios = salon.horarios.filter((_, idx) => idx !== bloqueIdx)
          return { ...salon, horarios: nuevosHorarios }
        }
        return salon
      })
      return { salones: salonesNuevos }
    })
  }


  if (loading)
    return (
      <CContainer className="py-4 d-flex justify-content-center">
        <CSpinner />
      </CContainer>
    )
  const handleNuevoSalon = () => {
    const nuevoId =
      disponibilidad.salones.length > 0
        ? Math.max(...disponibilidad.salones.map((s) => s.id)) + 1
        : 1

    const nuevoSalon = {
      id: nuevoId,
      nombre: `Nuevo salón ${nuevoId}`,
      horarios: [
        {
          bloque: `Bloque 1`,
          curso: "",
          profesor: "",
          rol: "",
        },
      ],
    }

    setDisponibilidad((prev) => ({
      salones: [...prev.salones, nuevoSalon],
    }))
  }

  const salonesDisponibles = disponibilidad.salones.filter((salon) =>
    salon.horarios.every(
      (h) => !h.curso && !h.profesor && !h.rol
    )
  ).slice(0, 3)

  return (
    <CContainer className="py-4">
      {error && (
        <p className="text-warning" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      )}
      <CCard>
        {salonesDisponibles.length > 0 && (
          <div className="mb-4">
            <h5>Salones disponibles (sin asignaciones)</h5>
            <ul>
              {salonesDisponibles.map((salon) => (
                <li key={salon.id}>{salon.nombre}</li>
              ))}
            </ul>
          </div>
        )}

        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h3>Disponibilidad de Espacios y Asignaciones</h3>
          {!modoEdicion ? (
            <CButton color="primary" onClick={() => setModoEdicion(true)}>
              Editar
            </CButton>
          ) : (
            <div className="d-flex gap-2 flex-wrap">
              <CButton color="success" onClick={handleGuardar} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </CButton>
              <CButton color="secondary" onClick={handleCancelar} disabled={guardando}>
                Cancelar
              </CButton>
              <CButton color="info" onClick={handleNuevoSalon} disabled={guardando}>
                + Nuevo salón
              </CButton>
            </div>
          )}
        </CCardHeader>

        <CCardBody>
          {disponibilidad.salones.map((salon) => (
            <div key={salon.id} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                {!modoEdicion ? (
                  <h5 className="mb-0">{salon.nombre}</h5>
                ) : (
                  <input
                    type="text"
                    className="form-control me-3"
                    style={{ maxWidth: "300px" }}
                    value={salon.nombre}
                    onChange={(e) =>
                      setDisponibilidad((prev) => {
                        const salonesActualizados = prev.salones.map((s) =>
                          s.id === salon.id ? { ...s, nombre: e.target.value } : s
                        )
                        return { salones: salonesActualizados }
                      })
                    }
                    placeholder="Nombre del salón"
                  />
                )}
                {modoEdicion && (
                  <CButton
                    size="sm"
                    color="info"
                    onClick={() => agregarBloque(salon.id)}
                  >
                    Agregar bloque
                  </CButton>
                )}
              </div>

              <CTable bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Bloque</CTableHeaderCell>
                    <CTableHeaderCell>Curso</CTableHeaderCell>
                    <CTableHeaderCell>Profesor</CTableHeaderCell>
                    <CTableHeaderCell>Rol de Supervisión</CTableHeaderCell>
                    {modoEdicion && <CTableHeaderCell>Acciones</CTableHeaderCell>}



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
                      {modoEdicion && (
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="danger"
                            onClick={() => borrarBloque(salon.id, idx)}
                          >
                            🗑️
                          </CButton>
                        </CTableDataCell>
                      )}

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
