// Debug script for playlist functionality
console.log('=== PLAYLIST DEBUG SCRIPT LOADED ===');

// Check if elements exist
setTimeout(() => {
    console.log('Checking playlist elements...');
    
    const createBtn = document.getElementById('createPlaylistBtn');
    const playlistsGrid = document.getElementById('playlistsGrid');
    const emptyMessage = document.getElementById('emptyPlaylistMessage');
    const createModal = document.getElementById('createPlaylistModal');
    
    console.log('Create Button:', createBtn ? '✅ Found' : '❌ Not found');
    console.log('Playlists Grid:', playlistsGrid ? '✅ Found' : '❌ Not found');
    console.log('Empty Message:', emptyMessage ? '✅ Found' : '❌ Not found');
    console.log('Create Modal:', createModal ? '✅ Found' : '❌ Not found');
    
    // Check if functions exist
    console.log('renderPlaylists function:', typeof renderPlaylists !== 'undefined' ? '✅ Defined' : '❌ Not defined');
    console.log('setupPlaylistEventListeners function:', typeof setupPlaylistEventListeners !== 'undefined' ? '✅ Defined' : '❌ Not defined');
    console.log('createPlaylist function:', typeof createPlaylist !== 'undefined' ? '✅ Defined' : '❌ Not defined');
    
    // Check localStorage
    const storedPlaylists = localStorage.getItem('jamifyPlaylists');
    console.log('Stored playlists:', storedPlaylists || 'None');
    
    // Check if playlists variable exists
    if (typeof playlists !== 'undefined') {
        console.log('Playlists array:', playlists);
        console.log('Number of playlists:', playlists.length);
    } else {
        console.log('❌ playlists variable not defined');
    }
    
    // Test button click
    if (createBtn) {
        console.log('Testing button click...');
        createBtn.addEventListener('click', () => {
            console.log('✅ Create button clicked!');
        });
    }
    
    // Check CSS
    if (playlistsGrid) {
        const styles = window.getComputedStyle(playlistsGrid);
        console.log('Grid display:', styles.display);
        console.log('Grid visibility:', styles.visibility);
        console.log('Grid opacity:', styles.opacity);
    }
    
    console.log('=== DEBUG CHECK COMPLETE ===');
}, 1000);

