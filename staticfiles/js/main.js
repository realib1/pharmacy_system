document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sidebar...');

    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const topNav = document.getElementById('topNav');
    const sidebarState = localStorage.getItem('sidebarState');

    console.log('Initial sidebar state:', sidebarState);

    // Set initial state based on localStorage
    if (sidebarState === 'collapsed') {
        sidebar.classList.add('w-20');
        sidebar.classList.remove('w-60');
        mainContent.classList.remove('ml-60');
        mainContent.classList.add('ml-20');
        topNav.classList.remove('left-60');
        topNav.classList.add('left-20');
        if (toggleIcon) {
            toggleIcon.style.transform = 'rotate(180deg)';
        }
    }

    if (sidebarToggle && sidebar && mainContent && topNav) {
        console.log('All sidebar elements found, adding click listener');
        sidebarToggle.addEventListener('click', function() {
            console.log('Sidebar toggle clicked');
            sidebar.classList.toggle('w-60');
            sidebar.classList.toggle('w-20');
            mainContent.classList.toggle('ml-60');
            mainContent.classList.toggle('ml-20');
            topNav.classList.toggle('left-60');
            topNav.classList.toggle('left-20');

            // Rotate icon
            if (toggleIcon) {
                toggleIcon.style.transform = sidebar.classList.contains('w-20') ? 'rotate(180deg)' : 'rotate(0deg)';
            }

            // Store sidebar state in localStorage
            const newState = sidebar.classList.contains('w-20') ? 'collapsed' : 'expanded';
            console.log('Setting sidebar state to:', newState);
            localStorage.setItem('sidebarState', newState);
        });
    } else {
        console.warn('Some sidebar elements not found:', {
            sidebarToggle: !!sidebarToggle,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            topNav: !!topNav
        });
    }

    // User menu dropdown functionality
    const userMenuButton = document.querySelector('.menu-icon button');
    const userMenuDropdown = document.querySelector('.user-menu ul');

    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.user-menu')) {
                userMenuDropdown.classList.add('hidden');
            }
        });
    }

      // Message disappear functionality
      const message = document.querySelector('.message');
      if (message) {
          setTimeout(() => {
              message.classList.add('hidden');
          }, 5000); // 5 seconds
      }
});