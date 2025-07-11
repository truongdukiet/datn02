@component('mail::message')
# Xác thực tài khoản

Xin chào {{ $user->Fullname ?? $user->Email }},

Cảm ơn bạn đã đăng ký tài khoản tại {{ config('app.name') }}.<br>
Vui lòng nhấn vào nút bên dưới để xác thực email và kích hoạt tài khoản:

@component('mail::button', ['url' => $actionUrl])
Xác thực tài khoản
@endcomponent

Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.

Trân trọng,<br>
{{ config('app.name') }}
@endcomponent
