<?php

namespace Tests\Unit;

use App\Models\Payment;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_example(): void
    {
        $this->assertTrue(true);
    }

    #[Test]
    public function it_detects_visa_card_type()
    {
        $cardType = Payment::getCardType('4111111111111111');
        $this->assertEquals('Visa', $cardType);
    }

    #[Test]
    public function it_detects_mastercard_type()
    {
        $cardType = Payment::getCardType('5555555555554444');
        $this->assertEquals('Mastercard', $cardType);
    }

    #[Test]
    public function it_detects_american_express_type()
    {
        $cardType = Payment::getCardType('378282246310005');
        $this->assertEquals('American Express', $cardType);
    }

    #[Test]
    public function it_detects_discover_type()
    {
        $cardType = Payment::getCardType('6011111111111117');
        $this->assertEquals('Discover', $cardType);
    }

    #[Test]
    public function it_returns_unknown_for_invalid_card()
    {
        $cardType = Payment::getCardType('9999999999999999');
        $this->assertEquals('Unknown', $cardType);
    }

    #[Test]
    public function it_extracts_last_four_digits()
    {
        $lastFour = Payment::getLastFourDigits('4111111111111111');
        $this->assertEquals('1111', $lastFour);
    }

    #[Test]
    public function it_extracts_last_four_digits_with_spaces()
    {
        $lastFour = Payment::getLastFourDigits('4111 1111 1111 1111');
        $this->assertEquals('1111', $lastFour);
    }

    #[Test]
    public function it_handles_short_card_numbers()
    {
        $lastFour = Payment::getLastFourDigits('1234');
        $this->assertEquals('1234', $lastFour);
    }
}
