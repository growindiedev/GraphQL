  
import React from 'react'
import {useFormik} from 'formik'

const Authors = (props) => {

    const formik = useFormik({
        initialValues: {
          name: '',
          born: ''
        },
        onSubmit: ({name, born}, {resetForm}) => {
            props.editAuthor({ variables: {name, born: parseInt(born)}})
            resetForm()
        },
      });
  

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {props.authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={formik.handleSubmit}>
          <input 
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          name="name"
          placeholder="name"
          />
          

          <input 
          type="text"
          onChange={formik.handleChange}
          value={formik.values.born}
          name="born"
          placeholder="born"
          />
          <button type="submit">create</button>
      </form>

    </div>
  )
}

export default Authors