console.log("Welcome to Spotify");
// array of objects
let songs=[
    {songName: "Hass Hass - Diljit Dosanjh", filePath: "songs/1.mp3", coverPath: "covers/c1.jpg"},
    {songName: "Tum Se Hi - Mohit Chauhan", filePath: "songs/2.mp3", coverPath: "covers/c2.jpg"},
    {songName: "Nadaan Parindey - AR Rahman", filePath: "songs/3.mp3", coverPath: "covers/c3.jpg"},
    {songName: "Tune Jo Na Kaha - Mohit Chauhan", filePath: "songs/4.mp3", coverPath: "covers/c4.jpg"},
    {songName: "Farmaish - Parmish Verma", filePath: "songs/5.mp3", coverPath: "covers/c5.jpg"},
    {songName: "Alfaazo - Mitraz", filePath: "songs/6.mp3", coverPath: "covers/c6.jpg"},
    {songName: "Meri Sardarniya - Ranjit Bawa", filePath: "songs/7.mp3", coverPath: "covers/c7.jpg"},
    {songName: "Jaanu - Garry Sandhu", filePath: "songs/8.mp3", coverPath: "covers/c8.jpg"}
]

// Intitalize the variables
let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filePath);
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let remainingTime = document.getElementById("remainingTime");

// call back function
songItems.forEach((element, i) => {
    // console.log(element,i);
    if(songs[i]){
        element.getElementsByTagName("img")[0].src = songs[i].coverPath;
        element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
    }
});

// song will play
// audioElement.play();

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    // when audio is paused
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;

         // Sync container button
         makeAllPlays();
         document.getElementById(songIndex).classList.remove('fa-circle-play');
         document.getElementById(songIndex).classList.add('fa-circle-pause');
    }
    else{
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;  

         // Sync container button
         makeAllPlays();
         document.getElementById(songIndex).classList.add('fa-circle-play');
         document.getElementById(songIndex).classList.remove('fa-circle-pause');

    }
})
// Listen to time update for progress bar

audioElement.addEventListener('timeupdate', ()=>{
    // console.log('timeupdate')
    // update seekbar
    // percentage of audio completed
   let progress = parseInt((audioElement.currentTime/audioElement.duration)* 100);
//    reamining time
let remaining = audioElement.duration - audioElement.currentTime;
// converts to minutes and seconds and removes decimal with floor
let remMin = Math.floor(remaining / 60);
let remSec = Math.floor(remaining % 60);
// adds leading zero to seconds
if(remSec < 10)
{
    remSec = "0" + remSec;
}
// duration will not display if song is not loaded and shows the original duration in minus
if(!isNaN(remMin) && !isNaN(remSec)){
    remainingTime.innerHTML =  `-${remMin}:${remSec}`;
}
    // console.log(progress);
    // progress bar will update when initial value is 0
    myProgressBar.value = progress;
})
// when we need to forward the song
myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})

// Reset all play icons
const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    })

}
// play/pause a song from the list
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click', (e)=>{
        let clickedIndex = parseInt(e.target.id);

        if(songIndex === clickedIndex && !audioElement.paused){  
            // Pause if same song is playing
            audioElement.pause();
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
            gif.style.opacity = 0;
        } else {
            // Play new song
            makeAllPlays();
            songIndex = clickedIndex;
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            audioElement.src = songs[songIndex].filePath;
            masterSongName.innerText = songs[songIndex].songName;
            audioElement.currentTime = 0;
            audioElement.play();
            gif.style.opacity = 1;
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
        }
    });
});

// when next icon is clicked
document.getElementById('next').addEventListener('click', ()=>{
    if(songIndex>=8){
        songIndex = 0;
    }
    else{
        songIndex += 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
})

// when previous icon is clicked
document.getElementById('previous').addEventListener('click', ()=>{
    if(songIndex<=0){
        songIndex = 0;
    }
    else{
        songIndex -= 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
})

// search bar
searchBtn.addEventListener('click', ()=>{
    // get the text you typed(case-insensitive)
    let filter = searchInput.value.toLowerCase();
    let songItems = Array.from(document.getElementsByClassName('songItem'));

    songItems.forEach((item)=>{
        let songNameElement = item.getElementsByClassName('songName')[0];
        let songName = songNameElement.innerText;

        // compare with search
        if(songName.toLowerCase().includes(filter)){
            item.style.display = "flex";

            // if find then highlight matched part
            let regex = new RegExp(`(${filter})`, "gi");
            songNameElement.innerHTML = songName.replace(regex, `<span class="highlight">$1</span>`);  
        }
        else{
            // if not founf=d then hide it
            item.style.display = "none";
            songNameElement.innerHTML = songName;
        }

        // reset the search bar
        if(filter === ""){
            // shows all songs again
            songNameElement.innerHTML = songName;
            item.style.display = "flex";
        }
    });

});



