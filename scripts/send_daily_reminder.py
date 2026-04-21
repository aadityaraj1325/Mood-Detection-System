from datetime import datetime


def build_reminder_message(name: str) -> str:
    now = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
    return f"Hi {name}, it is {now}. Please complete your quick mood check-in on PulseMind AI."


if __name__ == '__main__':
    print(build_reminder_message('Student'))
