import React, { Component } from 'react';
import PropTypes from 'prop-types'; 

class CommentInput extends Component {
    // 静态属性
    static propTypes = {
        comment : PropTypes.func
    }
    
    // 构造函数
    constructor () {
        super();
        this.state = {
          username: '',
          content: ''
        };
    }

    // 组件生命周期
    componentWillMount () {
        this._loadUsername();
    }

    componentDidMount () {
        this.textarea.focus();
    }
    
    // 私有方法
    _loadUsername () {
        const username = localStorage.getItem('username');
        if (username) {
            this.setState({ username });
        }
    }    

    _saveUsername (username) {
        localStorage.setItem('username', username);
    }    

    // 事件函数
    handleUsernameChange (event) {
        this.setState({
          username: event.target.value
        });
    }

    handleContentChange (event) {
        this.setState({
          content: event.target.value
        });
    }

    handleSubmit () {
        if (this.props.onSubmit) {
          this.props.onSubmit({
            username: this.state.username,
            content: this.state.content,
            createdTime: +new Date()
          });
        }
        this.setState({ content: '' });
    }

    handleUsernameBlur (event) {
        this._saveUsername(event.target.value);
    }

    // 渲染
    render() {
        return (
            <div className='comment-input'>
            <div className='comment-field'>
            <span className='comment-field-name'>用户名：</span>
            <div className='comment-field-input'>
                <input 
                    value={this.state.username}
                    onChange={this.handleUsernameChange.bind(this)}
                    onBlur={this.handleUsernameBlur.bind(this)}    
                />
            </div>
            </div>
            <div className='comment-field'>
            <span className='comment-field-name'>评论内容：</span>
            <div className='comment-field-input'>
                <textarea 
                    ref={(textarea)=>{this.textarea = textarea;}}
                    value={this.state.content}
                    onChange={this.handleContentChange.bind(this)}    
                />
            </div>
            </div>
            <div className='comment-field-button'>
            <button onClick={this.handleSubmit.bind(this)}>
                发布
            </button>
            </div>
        </div>
        );
    }


}

export default CommentInput;