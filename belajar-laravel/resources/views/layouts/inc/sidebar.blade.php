<div id="sidebar" class="active">
    <div class="sidebar-wrapper active">
        <div class="sidebar-header">
            <div class="d-flex justify-content-between">
                <div class="logo">
                    <a href="index.html"><img src="{{ asset('template/dist/assets/images/logo/logo.png')}}" alt="Logo"
                            srcset=""></a>
                </div>
                <div class="toggler">
                    <a href="#" class="sidebar-hide d-xl-none d-block"><i class="bi bi-x bi-middle"></i></a>
                </div>
            </div>
        </div>
        <div class="sidebar-menu">
            <ul class="menu">
                <li class="sidebar-title">Menu</li>

                <li class="sidebar-item {{ request()->is('dashboard') ? 'active' : '' }}">
                    <a href="{{ url('dashboard') }}" class='sidebar-link'>
                        <i class="bi bi-grid-fill"></i>
                        <span>Dashboard</span>
                    </a>
                </li>

                <li class="sidebar-item has-sub {{ request()->is('user*') || request()->is('role*') ? 'active' : '' }}">
                    <a href="#" class='sidebar-link'>
                        <i class="bi bi-person-badge-fill"></i>
                        <span>User Management</span>
                    </a>
                    <ul class="submenu {{ request()->is('user*') || request()->is('role*') ? 'submenu-open' : '' }}">
                        <li class="submenu-item {{ request()->is('user*') ? 'active' : '' }}">
                            <a href="{{ route('user.index') }}">Data User</a>
                        </li>
                        <li class="submenu-item {{ request()->is('user/create') ? 'active' : '' }}">
                            <a href="{{ route('user.create') }}">Create User</a>
                        </li>
                        <li class="submenu-item {{ request()->is('role') ? 'active' : '' }}">
                            <a href="{{ route('role.index') }}">Role</a>
                        </li>
                        <li class="submenu-item {{ request()->is('role/create') ? 'active' : '' }}">
                            <a href="{{ route('role.create') }}">Create Role</a>
                        </li>
                    </ul>
                </li>

                <li class="sidebar-item {{ request()->is('locker*') ? 'active' : '' }}">
                    <a href="{{ route('locker.index') }}" class='sidebar-link'>
                        <i class="bi bi-lock-fill"></i>
                        <span>Locker</span>
                    </a>
                </li>

                <li class="sidebar-item">
                    <form action="{{ route('action-logout') }}" method="post">
                        @csrf
                        <button type="submit" class="btn btn-danger">
                            Log Out
                        </button>
                    </form>
                </li>
            </ul>
        </div>
        <button class="sidebar-toggler btn x"><i data-feather="x"></i></button>
    </div>
</div>