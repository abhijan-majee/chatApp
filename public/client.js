        
        const socket = io();

        const form=document.getElementById("send-container");
        const messageInput=document.getElementById("msgInp");
        const messageContainer=document.querySelector(".contain");
        var audio=new Audio("/ting.mp3");


        const append = (message,position)=>{
          const messageElement = document.createElement('div');
          messageElement.innerText= message;
          messageElement.classList.add("message");
          messageElement.classList.add(position);
          messageContainer.append(messageElement);
          if(position=="left"){
            audio.play();
          }
        }

        form.addEventListener('submit',(e)=>{
          e.preventDefault();
          const message= messageInput.value;
          append(`You: ${message}`,'right');
          socket.emit('send',message);
          messageInput.value='';
        })

        

        const nam=prompt("Enter your name to join this chat: ");
        socket.emit('new-user-joined',nam);



        socket.on('user-joined', nam=>{
          append(`${nam} has joined the chat`,'right');
        })

        socket.on('receive', data=>{
          append(`${data.name}: ${data.message}`,'left');
        })


        socket.on('leave',name=>{
          append(`${name} left the chat`,'left');
        })