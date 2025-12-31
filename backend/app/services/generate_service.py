from app.llm.generator import generate_outputs
from app.services.job_repository import update_job_result, mark_job_error
import traceback


async def trigger_generation(job_id: str, payload):
    print(f"\n===== LLM GENERATION START | job={job_id} =====")

    try:
        outputs = generate_outputs(payload)

        print("\n----- GENERATED OUTPUT -----")
        for service, result in outputs.items():
            print(f"\n[{service.upper()}]")
            print(result)
        print("----------------------------")

        print(f"===== LLM GENERATION END | job={job_id} =====\n")

        # ✅ STORE RESULT IN DB
        update_job_result(job_id, outputs)

        return outputs

    except Exception as e:
        traceback.print_exc()
        mark_job_error(job_id, str(e))
        raise
