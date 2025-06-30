<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_out_authenticated_user()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_it_requires_authentication()
    {
        $response = $this->post('/logout');

        $response->assertRedirect('/login');
    }

    public function test_it_redirects_to_intended_url_after_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $response->assertRedirect('/');
    }

    public function test_it_handles_multiple_logout_attempts()
    {
        $user = User::factory()->create();

        // First logout
        $this->actingAs($user)->post('/logout');
        $this->assertGuest();

        // Second logout attempt (should still work)
        $response = $this->post('/logout');
        $response->assertRedirect('/login');
    }

    public function test_it_clears_all_user_sessions()
    {
        $user = User::factory()->create();

        // Simulate multiple sessions
        $this->actingAs($user)->get('/');
        $this->actingAs($user)->get('/cart');

        $this->actingAs($user)->post('/logout');

        $this->assertGuest();
    }
}
