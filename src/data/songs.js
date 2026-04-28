// Import artist images
import darshanImg from '../Artist/darshan.jpeg'
import arijitImg from '../Artist/arijit singh.jpeg'
import jubinImg from '../Artist/jubin nautiyal.jpeg'
import gajendraImg from '../Artist/gajendra verma.jpeg'
import anuvImg from '../Artist/Anuv Jain.jpg'

// Import song images
import arzKiyaHaiImg from '../songs/arz kiya hai.jpg'
import mahiyeJinnaImg from '../songs/mahiye jinna sohna.jpg'
import aabaadBarbadImg from '../songs/aabad barbad.jpg'

// Import playlist images
import arijitCollectionImg from '../playlist/arijit collection/arijit collection.jpeg'
import ninetysSongsImg from '../playlist/90s songs/90s song.jpg'
import cokeStudioImg from '../playlist/coke studio/coke studio.jpg'
import oldHindiImg from '../playlist/old songs/old song.jpg'
import southIndianImg from '../playlist/south songs/south songs.jpg'
import urduCollectionImg from '../playlist/urdu songs/Urdu song.jpg'

export const trendingSongs = [
  {
    id: 1,
    title: 'Arz Kiya Hai',
    artist: 'Coke Studio',
    image: arzKiyaHaiImg,
    audio: 'Arz Kiya Hai _ Coke Studio Bharat - (Raag.Fm) (1).mp3',
    plays: '2.5M',
    duration: '4:32',
    trend: 'up',
    genre: 'Classical'
  },
  {
    id: 2,
    title: 'Jhol',
    artist: 'Diljit Dosanjh',
    image: darshanImg,
    audio: 'Jhol(KoshalWorld.Com).mp3',
    plays: '3.2M',
    duration: '3:45',
    trend: 'up',
    genre: 'Punjabi'
  },
  {
    id: 3,
    title: 'Mahiye Jinna Sohna',
    artist: 'Diljit Dosanjh',
    image: mahiyeJinnaImg,
    audio: 'Mahiye Jinna Sohna_320(PagalWorld.com.sb).mp3',
    plays: '4.1M',
    duration: '3:58',
    trend: 'up',
    genre: 'Punjabi'
  },
  {
    id: 4,
    title: 'Barbaad',
    artist: 'Jubin Nautiyal',
    image: jubinImg,
    audio: 'Barbaad Saiyaara 320 Kbps.mp3',
    plays: '1.8M',
    duration: '4:15',
    trend: 'same',
    genre: 'Romantic'
  },
  {
    id: 5,
    title: 'Aabaad Barbaad',
    artist: 'Arijit Singh',
    image: aabaadBarbadImg,
    audio: 'Aabaad Barbaad - Arijit Singh.mp3',
    plays: '5.6M',
    duration: '4:20',
    trend: 'up',
    genre: 'Romantic'
  },
  {
    id: 6,
    title: 'Saiyaara',
    artist: 'Mohit Chauhan',
    image: arijitImg,
    audio: 'Title Track Saiyaara 320 Kbps.mp3',
    plays: '2.9M',
    duration: '5:10',
    trend: 'down',
    genre: 'Romantic'
  },
  {
    id: 7,
    title: 'Baarishon Mein',
    artist: 'Darshan Raval',
    image: darshanImg,
    audio: 'Baarishon Mein Darshan Raval 320 Kbps.mp3',
    plays: '3.7M',
    duration: '3:22',
    trend: 'up',
    genre: 'Pop'
  },
  {
    id: 8,
    title: 'Hawa Banke',
    artist: 'Darshan Raval',
    image: darshanImg,
    audio: 'Hawa Banke - Darshan Raval-(PagalWorld.Ink).mp3',
    plays: '4.5M',
    duration: '3:50',
    trend: 'up',
    genre: 'Pop'
  },
  {
    id: 9,
    title: 'Tera Ho Gaya',
    artist: 'Atif Aslam',
    image: arijitImg,
    audio: 'Tera Ho Gaya_320(PagalWorld.com.sb).mp3',
    plays: '2.1M',
    duration: '4:05',
    trend: 'same',
    genre: 'Romantic'
  },
  {
    id: 10,
    title: 'Asal Mein',
    artist: 'Darshan Raval',
    image: darshanImg,
    audio: 'Asal Mein Asal Mein Single 320 Kbps.mp3',
    plays: '3.3M',
    duration: '3:40',
    trend: 'up',
    genre: 'Pop'
  }
];

export const trendingArtists = [
  { id: 1, name: 'Darshan Raval', image: darshanImg, songs: 25, followers: '5.2M', verified: true, rank: 1 },
  { id: 2, name: 'Arijit Singh', image: arijitImg, songs: 150, followers: '12.8M', verified: true, rank: 2 },
  { id: 3, name: 'Jubin Nautiyal', image: jubinImg, songs: 45, followers: '3.9M', verified: true, rank: 3 },
  { id: 4, name: 'Gajendra Verma', image: gajendraImg, songs: 30, followers: '2.1M', verified: true, rank: 4 },
  { id: 5, name: 'Anuv Jain', image: anuvImg, songs: 20, followers: '1.5M', verified: true, rank: 5 }
];

export const playlists = [
  {
    id: 1,
    name: 'Arijit Collection',
    image: arijitCollectionImg,
    songs: [
      { id: 101, title: 'Chal Ghar Chalen', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/01 - Chal Ghar Chalen - DownloadMing.SE.mp3', duration: '4:32' },
      { id: 102, title: 'Aabaad Barbaad', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/Aabaad Barbaad - Arijit Singh.mp3', duration: '4:20' },
      { id: 103, title: 'Arz Kiya Hai', artist: 'Coke Studio', audio: 'src/playlist/arijit collection/Arz Kiya Hai _ Coke Studio Bharat - (Raag.Fm) (1).mp3', duration: '4:15' },
      { id: 104, title: 'Aur Mohabbat Kitni Karoon', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/Aur Mohabbat Kitni Karoon - Metro In Dino 320 Kbps.mp3', duration: '3:58' },
      { id: 105, title: 'Bairiya', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/Bairiya Arijit Singh 320 Kbps.mp3', duration: '4:45' },
      { id: 106, title: 'Chaleya', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/Chaleya - Jawan-(DJMaza).mp3', duration: '3:42' },
      { id: 107, title: 'Hardum Humdum', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/Hardum Humdum - Arijit Singh.mp3', duration: '4:10' },
      { id: 108, title: 'Chahun Main Ya Naa', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/new_128_03 - Chahun Main Ya Naa - PagalSongs.com.mp3', duration: '3:55' },
      { id: 109, title: 'Hum Mar Jayenge', artist: 'Arijit Singh', audio: 'src/playlist/arijit collection/new_128_04 - Hum Mar Jayenge - PagalSongs.com.mp3', duration: '4:28' }
    ]
  },
  {
    id: 2,
    name: '90s Songs',
    image: ninetysSongsImg,
    songs: [
      { id: 201, title: 'Bahut Jatate Ho Chah Humse', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Bahut Jatate Ho Chah Humse(KoshalWorld.Com).mp3', duration: '5:12' },
      { id: 202, title: 'Bahut Pyar Karte Hai', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Bahut Pyar Karte Hai (Male Version)(KoshalWorld.Com).mp3', duration: '5:45' },
      { id: 203, title: 'Chori Chori Dil Tera Churayenge', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Chori Chori Dil Tera Churayenge(KoshalWorld.Com).mp3', duration: '5:20' },
      { id: 204, title: 'Pal Pal Dil Ke Paas', artist: 'Kishore Kumar', audio: 'src/playlist/90s songs/Pal Pal Dil Ke Paas(KoshalWorld.Com).mp3', duration: '4:55' },
      { id: 205, title: 'Tujhko Na Dekhun', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Tujhko Na Dekhun(KoshalWorld.Com).mp3', duration: '5:30' }
    ]
  },
  {
    id: 3,
    name: 'Coke Studio',
    image: cokeStudioImg,
    songs: [
      { id: 301, title: 'Arz Kiya Hai', artist: 'Coke Studio Bharat', audio: 'src/playlist/coke studio/Arz Kiya Hai _ Coke Studio Bharat - (Raag.Fm) (1).mp3', duration: '4:15' }
    ]
  },
  {
    id: 4,
    name: 'Old Hindi',
    image: oldHindiImg,
    songs: [
      { id: 401, title: 'Bahut Jatate Ho Chah Humse', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Bahut Jatate Ho Chah Humse(KoshalWorld.Com).mp3', duration: '5:12' },
      { id: 402, title: 'Bahut Pyar Karte Hai', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Bahut Pyar Karte Hai (Male Version)(KoshalWorld.Com).mp3', duration: '5:45' },
      { id: 403, title: 'Chori Chori Dil Tera Churayenge', artist: 'Kumar Sanu', audio: 'src/playlist/90s songs/Chori Chori Dil Tera Churayenge(KoshalWorld.Com).mp3', duration: '5:20' }
    ]
  },
  {
    id: 5,
    name: 'South Indian',
    image: southIndianImg,
    songs: [
      { id: 501, title: 'Beer Song', artist: 'Anirudh', audio: 'src/playlist/south songs/Beer-Song-MassTamilan.dev.mp3', duration: '3:45' },
      { id: 502, title: 'Coffee Shop', artist: 'Anirudh', audio: 'src/playlist/south songs/Coffee-Shop-MassTamilan.dev.mp3', duration: '3:30' },
      { id: 503, title: 'I am Always Free', artist: 'Anirudh', audio: 'src/playlist/south songs/I-am-Always-Free-MassTamilan.fm.mp3', duration: '3:20' },
      { id: 504, title: 'Madurai Feel Good', artist: 'Ajay Musical', audio: 'src/playlist/south songs/Madurai - Feel Good Bgm  An Ajay Musical.mp3', duration: '2:45' },
      { id: 505, title: 'Minnalvala', artist: 'South Artist', audio: 'src/playlist/south songs/Minnalvala(KoshalWorld.Com).mp3', duration: '4:10' },
      { id: 506, title: 'Peelings', artist: 'South Artist', audio: 'src/playlist/south songs/Peelings.mp3', duration: '3:55' },
      { id: 507, title: 'Singari', artist: 'Telugu Artist', audio: 'src/playlist/south songs/Singari (Telugu)(KoshalWorld.Com).mp3', duration: '4:25' },
      { id: 508, title: 'Smiling With The Pain', artist: 'Theme Music', audio: 'src/playlist/south songs/Smiling With The Pain Theme.mp3', duration: '3:15' },
      { id: 509, title: 'Sunrise Theme', artist: 'Theme Music', audio: 'src/playlist/south songs/Sunrise Theme.mp3', duration: '3:40' },
      { id: 510, title: 'The Cycle', artist: 'South Artist', audio: 'src/playlist/south songs/The Cycle.mp3', duration: '3:50' },
      { id: 511, title: 'The Love Bug Has Bitten', artist: 'South Artist', audio: 'src/playlist/south songs/The-Love-Bug-Has-Bitten.mp3', duration: '4:05' },
      { id: 512, title: 'Thiruchitrambalam Title', artist: 'Anirudh', audio: 'src/playlist/south songs/Thiruchitrambalam-Title-Theme-MassTamilan.dev.mp3', duration: '2:55' },
      { id: 513, title: 'Vizhi Veekura', artist: 'South Artist', audio: 'src/playlist/south songs/Vizhi Veekura.mp3', duration: '4:15' },
      { id: 514, title: 'Welcome To Hyderabad', artist: 'Premalu BGM', audio: 'src/playlist/south songs/Welcome To Hyderabad – Premalu _ BGM Ringtone - MobCup.Com.Co.mp3', duration: '3:25' }
    ]
  },
  {
    id: 6,
    name: 'Urdu Collection',
    image: urduCollectionImg,
    songs: [
      { id: 601, title: 'Iraaday', artist: 'Urdu Artist', audio: 'src/playlist/urdu songs/Iraaday(PaglaSongs).mp3', duration: '4:20' },
      { id: 602, title: 'Pal Pal', artist: 'Urdu Artist', audio: 'src/playlist/urdu songs/Pal Pal(KoshalWorld.Com).mp3', duration: '4:45' },
      { id: 603, title: 'Pasoori', artist: 'Shae Gill', audio: 'src/playlist/urdu songs/Pasoori - Shae Gill.mp3', duration: '3:55' },
      { id: 604, title: 'Sadqay', artist: 'Urdu Artist', audio: 'src/playlist/urdu songs/Sadqay-(PagalSongs.Com.IN).mp3', duration: '4:10' }
    ]
  }
];
