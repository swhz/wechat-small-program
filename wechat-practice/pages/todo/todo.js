const app = getApp()

Page({
  data: {
    todo: '',
    todos: [],
    filterTodos: [],
    filter: 'all',
    userInfo: {}
  },

  //页面加载获取用户信息并发起request请求todolist数据
  onLoad() {
    const that = this
    app.getUserInfo((userInfo) => {
      that.setData({
        userInfo: userInfo
      });
    });
    wx.request({
      url: 'http://swhzhuster.xin:3000/todos',
      success: (res) => {
        const todos = res.data
        that.setData({
          todos,
          filterTodos: todos
        })
      },
      fail: () => {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading'
        })
      }
    })
  },

  //添加待办
  bindTodoInput(e) {
    this.setData({
      todo: e.detail.value
    });
  },

  //保存todo到todos
  saveTodo(e) {
    const { todo, todos, filterTodos, filter } = this.data
    if (todo.trim().length === 0) return

    const newTodo = {
      id: new Date().getTime(),
      todo: this.data.todo,
      completed: false,
    }
    todos.push(newTodo)
    if (filter !== 'completed') {
      filterTodos.push(newTodo)
    }
    this.setData({
      todo: '',
      todos,
      filterTodos,
    })
  },

  //根据filter值返回相应过滤数组
  todoFilter(filter, todos) {
    return filter === 'all' ? todos
      : todos.filter(x => x.completed === (filter !== 'active'))
  },

  //切换todo状态
  toggleTodo(e) {
    const { todoId } = e.currentTarget.dataset
    const { filter } = this.data
    let { todos } = this.data
    todos = todos.map(todo => {
      if (Number(todoId) === todo.id) {
        todo.completed = !todo.completed
      }
      return todo
    });
    const filterTodos = this.todoFilter(filter, todos)
    this.setData({
      todos,
      filterTodos,
    })
  },

  //点击选项卡变换呈现的todo列表
  useFilter(e) {
    const { filter } = e.currentTarget.dataset
    const { todos } = this.data
    const filterTodos = this.todoFilter(filter, todos)
    this.setData({
      filter,
      filterTodos,
    })
  },

  //清除已完成的todo
  clearCompleted() {
    const { filter } = this.data
    let { todos } = this.data
    todos = todos.filter(x => !x.completed)
    this.setData({
      todos,
      filterTodos: this.todoFilter(filter, todos),
    });
  },

  //删除todo
  todoDel(e) {
    const { todoId } = e.currentTarget.dataset
    const { filter } = this.data
    let { todos } = this.data
    const todo = todos.find(x => Number(todoId) === x.id)
    todos = todos.filter(x => Number(todoId) !== x.id)
    this.setData({
      todos,
      filterTodos: this.todoFilter(filter, todos)
    });
  },

 //同步数据
  syncData() {
    const { todos } = this.data
    const that = this
    const Delete = (id) => {
      wx.request({
        url: 'http://swhzhuster.xin:3000/todos/'+id,
        method: 'DELETE',
        fail: () => {
          wx.showToast({
            title: '网络开小差了',
            icon: 'loading'
          })
        }
      })
    }
    const Post = (data) => {
      wx.request({
        url: 'http://swhzhuster.xin:3000/todos',
        data:data,
        method: 'POST',
        fail: () => {
          wx.showToast({
            title: '网络开小差了',
            icon: 'loading'
          })
        }
      })
    }
    wx.request({
      url: 'http://swhzhuster.xin:3000/todos',
      success: (res) => {
        const netTodos = res.data
        netTodos.forEach((todo) => {
          Delete(todo.id)
        })
        todos.forEach((todo) => {
          Post(todo)
        })
      },
      fail: () => {
        wx.showToast({
          title: '网络开小差了',
          icon: 'loading'
        })
      }
    })
  }
})
