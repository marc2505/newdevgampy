<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserMarcRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:50',
            'pseudo' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,'.$this->id,
        ];
        
        if ($this->filled('password')) {
            $rules['password'] = [
                'confirmed',
                Password::min(6)->letters()->symbols(),
            ];
        }

        return $rules;
    }
}
