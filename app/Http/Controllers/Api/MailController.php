<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function sendMail(Request $request) {
        $gampeur = User::where('id',$request->gampeur['id'])->first();
        $emailGampeur = $gampeur->email;
        $hote = $request->hote;
        $emailHote = $hote['email'];
        try{
            Mail::send([], [], function($message) use ($emailGampeur) {
                $message->to($emailGampeur);
                $message->subject('Confirmation de réservation');
                $message->html(
                    "
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                line-height: 1.4;
                                font-size: 0.9em;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .header {
                                background-color: #2FAF94;
                                padding: 20px;
                                text-align: center;
                                margin-bottom: 30px;
                            }
                            .header h1 {
                                margin: 0;
                                color: #fff;
                            }
                            .thank-you {
                                margin-bottom: 20px;
                            }
                            .footer {
                                font-size: 0.8em;
                                text-align: center;
                                margin-top: 30px;
                            }
                            a {
                                color: #2FAF94;
                                text-decoration: none;
                            }
                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class=\"container\">
                            <div class=\"header\">
                                <h1>Gampy</h1>
                            </div>
                            <div class=\"thank-you\">
                                <p>Bonjour,</p>
                                <p>Merci pour votre réservation sur notre plateforme Gampy.</p>
                            </div>
                            <div class=\"footer\">
                                <p>Visitez notre site web pour plus d'informations : <a href=\"http://localhost:3000\" target=\"_blank\">gampy.ch</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    "
                );
            });
            Mail::send([], [], function($message) use ($emailHote) {
                $message->to($emailHote);
                $message->subject('Nouvelle réservation');
                $message->html(
                    "
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                line-height: 1.4;
                                font-size: 0.9em;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                max-width: 800px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .header {
                                background-color: #2FAF94;
                                padding: 20px;
                                text-align: center;
                                margin-bottom: 30px;
                            }
                            .header h1 {
                                margin: 0;
                                color: #fff;
                            }
                            .thank-you {
                                margin-bottom: 20px;
                            }
                            .footer {
                                font-size: 0.8em;
                                text-align: center;
                                margin-top: 30px;
                            }
                            a {
                                color: #2FAF94;
                                text-decoration: none;
                            }
                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class=\"container\">
                            <div class=\"header\">
                                <h1>Gampy</h1>
                            </div>
                            <div class=\"thank-you\">
                                <p>Bonjour,</p>
                                <p>Vous avez une nouvelle réservation pour un de vos terrains.</p>
                            </div>
                            <div class=\"footer\">
                                <p>Visitez notre site web pour plus d'informations : <a href=\"http://localhost:3000\" target=\"_blank\">gampy.ch</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                    "
                );
            });
            return response()->json([
                'message'=>'Mail envoyé avec succès !'
            ], 200);
        } catch(\Exception $e) {
            return response()->json([
                'message'=>'Erreur dans l\'envoi du mail ...',
                'error'=>$e->getMessage()
            ], 500);
        }
    }
}
