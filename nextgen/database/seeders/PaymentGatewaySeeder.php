<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentGateway;

class PaymentGatewaySeeder extends Seeder
{
    public function run()
    {
        $gateways = [
            ['Name' => 'Thanh toán khi nhận hàng (COD)'],
            ['Name' => 'Thanh toán qua VNPay'],
            ['Name' => 'Thanh toán qua Momo'],
        ];

        foreach ($gateways as $gateway) {
            PaymentGateway::updateOrCreate(['Name' => $gateway['Name']], $gateway);
        }
    }
}
