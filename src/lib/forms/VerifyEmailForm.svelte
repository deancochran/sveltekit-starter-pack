<script>

	import { enhance } from "$app/forms";

</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1 class="h1">You need to verify your email</h1>
	</header>
	<section class="flex p-4 items-center align-middle justify-center">
        <div class="flex max-w-md text-center">
            <p>
                Your verification link was sent to your email. <span class="text-secondary-500">However</span>, if you need a new verification link, please click below
            </p>
            
        </div>
        <div class="flex">
            <form id="resend" method="post" action="?/resend" use:enhance/>
        </div>
	</section>
	<footer class="card-footer flex p-4 items-center align-middle justify-center">
		<button form="resend" type="submit" class="btn variant-filled-primary">Resend</button>
	</footer>
</div>
