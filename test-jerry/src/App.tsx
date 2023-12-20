import {CheckOutlined, CloseOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, List, Modal, Segmented, Space, Typography, notification } from 'antd'
import Card from 'antd/es/card/Card'
import Form, { useForm } from 'antd/es/form/Form'
import FormItem from 'antd/es/form/FormItem'
import Input from 'antd/es/input/Input'
import { useMemo, useState } from 'react'

type Todo={
  task:string,
  key:string,
  completed:boolean
}
function App() {
  const [todos,setTodos]=useState<Todo[]>([])
  const [filter,setFilter]=useState<"ALL"|"CHECKED"|"UNCHECKED">("ALL")
  const addTodo=(task:string)=>setTodos(oldTodo=>[...oldTodo,{completed:false,key:String(Math.random()),task}])
  const onUpdate=(todo:Todo)=>setTodos(old=>old.map(currentTodo=>currentTodo.key===todo.key?todo:currentTodo))
  const onDelete=(todoKey:string)=>setTodos(old=>old.filter(currentTodo=>currentTodo.key!==todoKey))
  const todosFiltered=useMemo(()=>todos.filter(todo=>{
    if(filter==="CHECKED") return todo.completed
    if(filter==="UNCHECKED") return !todo.completed
    return true
  }),[filter,todos])
  return (
    <Card title="Todo list" extra={<Space>
      <Segmented
      value={filter}
      onChange={(value)=>setFilter(value as "ALL")}
    options={[
      { value: 'ALL', icon: <UnorderedListOutlined /> },
      { value: 'CHECKED', icon: <CheckOutlined /> },
      { value: 'UNCHECKED', icon: <CloseOutlined />},
    ]}
  />
      <AddTodo onAdd={addTodo}/>
    </Space>
      } >
      <List   dataSource={todosFiltered} renderItem={(todo)=>{
        return <List.Item >
          <Flex justify='space-between' style={{width:"100%"}} >
            <Flex vertical style={{width:"100%"}}>
          <TodoTask todo={todo}  onUpdate={onUpdate}/>
          <Typography.Text copyable={{text:todo.key}}>
            {todo.key}
          </Typography.Text>
            </Flex>
          <Space>
          <DeleteTodo todo={todo} onDelete={onDelete}/>
          <Completed todo={todo}  onUpdate={onUpdate}/>
          </Space>
          </Flex>
        </List.Item>
      }} />
    </Card>
  )
}

type TodoTaskProps={
  todo:Todo
  onUpdate:(todo:Todo)=>void
}
function TodoTask({onUpdate,todo}:TodoTaskProps) {
  return <Typography.Paragraph   editable={{onChange(task) {
    onUpdate({...todo,task})
  },}} >
  {todo.task}
  </Typography.Paragraph>
}

type AddTodoProps={
  onAdd:(task:string)=>void
}
type DeleteTodoProps={
  todo:Todo,
  onDelete:(todoKey:string)=>void
}
function DeleteTodo({onDelete,todo}:DeleteTodoProps) {
  return <Button danger onClick={()=>{
    onDelete(todo.key)
    notification.success({message:"Suppression Reussi!",description:"le todo a été bien effacer",placement:"bottomRight"})
  }} type='text' icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg>} />
}
function AddTodo({onAdd}:AddTodoProps) {
  const [form]=useForm()
  const [open,setOpen]=useState(false)
  return <>
  <Button onClick={()=>setOpen(true)} >Ajouter</Button>
  <Modal open={open} title="Nouveau" onCancel={()=>setOpen(false)} onOk={()=>form.submit()} >
    <Form form={form} onFinish={(data:{task:string})=>{
      onAdd(data.task)
      form.resetFields()
      setOpen(false)
      notification.success({message:"Creation Reussi!",
    description:"le todo a été bien Crée",placement:"bottomRight"})
    }} >
      <FormItem name='task' rules={[{required:true},{min:6}]}> 
    <Input  />
      </FormItem>
    </Form>
  </Modal>
  </>
}
type CompletedProps={
  todo:Todo
  onUpdate:(todo:Todo)=>void
}
function Completed({todo,onUpdate}:CompletedProps) {
  return <Checkbox checked={todo.completed} onChange={(e)=>{
    onUpdate({...todo,completed:e.target.checked});
    notification.success({message:"Mise a jour Reussi!",
    description:"le todo a été bien mise a jour",placement:"bottomRight"})}} 
    > completed </Checkbox>
}
export default App
