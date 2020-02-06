var app = new Vue({
  el: '#pomo',
  data: {
    time_remaining: 1500, // 25 minutes = 60 * 25
    timer_state: 'work', //'work' or 'rest'
    timer_running: false,
    timer_paused: false,
    timer_id: null
  },
  methods: {
    timer: function (action) {
      switch(action) {
        case 'start':
          if(!this.timer_running) {
            this.timer_id = setInterval(this.tick, 1000)
            this.timer_running = true
          }
          break;
        case 'pause':
          if(this.timer_running) this.timer_paused = !this.timer_paused
          break;
        case 'reset':
          clearInterval(this.timer_id)
          this.timer_id = null
          this.time_remaining = 1500
          this.timer_running = false
          this.timer_paused = false
          this.timer_state = 'work'
          break;
        case 'skip':
          if(this.timer_running && !this.timer_paused) {
            this.skip()
          }
          break;
        default:
          break;
      }
    },
    tick: function() {
      if(this.timer_running && !this.timer_paused) {
        if(this.time_remaining > 0) {
          this.time_remaining--;
        } else {
          //End of countdown
          this.skip()
          
        }
      }
    },
    skip: function() {
      this.time_remaining = (this.timer_state == 'work') ? 300 : 1500
      this.timer_state = (this.timer_state == 'work') ? 'rest' : 'work'

      spawnNotification((this.timer_state == 'work') ? 'I gotta get back to work!' : 'I could use a break now :P', 'https://image.flaticon.com/icons/png/512/123/123223.png', 'Pomodoro Timer')
    }
  }
})

//upon finalising the app and hosting it I faced an issue while viewing it on my iphone due to
// the browser not supporting notifications and the error not being handled.
//So I implemented a try, catch.
try {
  Notification.requestPermission()
      .then(() => doSomething())                                                                                                                                               
} catch (error) {
  if (error instanceof TypeError) {
      Notification.requestPermission(() => {                                                                                                                                                             
          alert("This browser does not support notifications!");
      });
  } else {
      alert("Carry on!");                                                                                                                                                                                       
  }                                                                                                                                                                                                      
}    


function spawnNotification(body, icon, title) {
  var options = {
      body: body,
      icon: icon
  };
  var n = new Notification(title, options);
}

var app = new Vue({
    el: '#notes',
    data: {
        title: 'Take a few notes for later!',
        note: {
            text: '',
            date: ''
        },
        notes: [{
            text: 'PomoNotes',
            date: new Date(Date.now()).toLocaleString()
        }]
    },
    methods: {
        addNote() {
            let {
                text, title, color
            } = this.note
            this.notes.push({
                text,
                date: new Date(Date.now()).toLocaleString(),
            })
        },
        removeNote(index) {
            this.$delete(this.notes, index)
        },

    },
    mounted() {
        if (localStorage.getItem('notes')) this.notes = JSON.parse(localStorage.getItem('notes'));
    },
    watch: {
        notes: {
            handler() {
                localStorage.setItem('notes', JSON.stringify(this.notes));
            },
            deep: true,
        },
    }
})
